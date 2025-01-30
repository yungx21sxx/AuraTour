<script setup lang="ts">
	import useCreateListing from "~/modules/Admin/ListingCRUD/composables/useCreateListing";
	import type {RoomCreateDTO} from "~/types/dto.types";
	import FileUploader from "~/modules/Admin/ListingCRUD/components/FileUploader.vue";
	import PeriodsCreater from "~/modules/Admin/ListingCRUD/components/PeriodsCreater.vue";
	import type {RoomCreateFormData} from "~/modules/Admin/ListingCRUD/types/form-data.types";
	import {mdiClose} from "@mdi/js";
	import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
	import BedIcon from "~/modules/Listing/icons/BedIcon.vue";
	import FitIcon from "~/modules/Listing/icons/FitIcon.vue";
	import RoomsIcon from "~/modules/Listing/icons/RoomsIcon.vue";
	
	const {listingFormData} = useCreateListing()
	
	defineProps<{
		edit?: boolean
	}>()
	
	
	const {isMobile} = useDevice();
	const roomDefault = {
		name: null,
		places: null,
		area: null,
		badCount: null,
		minPrice: null,
		extraPlaces: 0,
		includedDescription: null,
		pricePeriods: [],
		amenities: [],
		photos: []
	};
	
	
	
	const formRules = {
		name: [
			(v: string) => (!!v) || 'Введите название номера.',
		],
		places: [
			(v: number) => (!!v) || 'Введите количесвто мест.',
		],
		area: [
			(v: number) => (!!v) || 'Введите площадь.',
		],
		badCount: [
			(v: number) => (!!v) || 'Введите количество комнат.',
		],
		minPrice: [
			(v: number) => (!!v) || 'Введите минимальную цену.',
		],
		amenities: [
			(v: string[]) => (!!v) || 'Укажите удобства',
		],
	}
	
	
	
	let roomFormData = ref<RoomCreateFormData>({...structuredClone(roomDefault), id: Math.floor(Math.random() * 1001)});
	const errors = ref([]);

	
	const createRoom = async () => {
		console.log('create')
		if (formRef.value) {
			const { valid } = await formRef.value.validate();
			if (!valid) {
				return;
			}
		} else {
			console.error('Form ref is not defined');
			return;
		}
		if (roomFormData.value.photos.length === 0) {
			errors.value = ['Фотографии не загружены'];
			return;
		}
		listingFormData.value.rooms.push(roomFormData.value);
		console.log(listingFormData.value.rooms)
		roomFormData.value = {...structuredClone(roomDefault), id: Math.floor(Math.random() * 1001)}
		
		const minRoomPrice = Math.min.apply(null, listingFormData.value.rooms.map(i => i.minPrice));
		listingFormData.value.minPrice = minRoomPrice;
		roomFormModal.value = false;
	}
	
	const roomToEdit = ref<RoomCreateFormData | null>(null);
	const roomFormModal = ref(false);
	
	const startRoomEdit = (room: RoomCreateFormData) => {
		roomFormData.value = room;
		roomToEdit.value = room;
		roomFormModal.value = true;
	}
	
	const saveRoomChanges = async () => {
		console.log('dsfdsf')
		if (formRef.value) {
			const { valid } = await formRef.value.validate();
			if (!valid) {
				return;
			}
		} else {
			console.error('Form ref is not defined');
			return;
		}
		if (roomFormData.value.photos.length === 0) {
			errors.value = ['Фотографии не загружены'];
			return;
		}
		if (roomFormData.value.amenities.length === 0) {
			errors.value = ['Удобства не указаны'];
			return;
		}
		
		roomFormData.value = {...structuredClone(roomDefault), id: Math.floor(Math.random() * 1001)};
		const minRoomPrice = Math.min.apply(null, listingFormData.value.rooms.map(i => i.minPrice));
		listingFormData.value.minPrice = minRoomPrice;
		roomFormModal.value = false;
		roomToEdit.value = null;
	}
	
	const formRef = ref(null)
	
	const roomsAmenities = ['Кондиционер', 'Телевизор', 'Wi-Fi', 'Душ и туалет в номере', 'Душ и туалет на этаже', 'Фен', 'Письменный стол', 'Стенной шкаф или гардероб','Холодильник', 'Вид на море', 'Вид на горы', 'Вид на город', 'Балкон / Терраса'];
	
	const deleteRoom = (id: number) => {
		listingFormData.value.rooms = listingFormData.value.rooms.filter(room => room.id !== id);
	}
	
	const onSubmit = async () => {
		console.log(roomToEdit.value)
		if (roomToEdit.value) {
			await saveRoomChanges()
		} else {
			await createRoom()
		}
	}
</script>

<template>
	<v-dialog v-model="roomFormModal" :fullscreen="isMobile" max-width="650px">
		<v-card>
			<v-toolbar :title="roomToEdit ? 'Редактировать номер' : 'Создать номер'">
				<v-btn :icon="mdiClose" @click="roomFormModal = false"/>
			</v-toolbar>
			
				<v-form @submit.prevent="onSubmit" ref="formRef" class="room-create-form">
					<v-text-field :rules="formRules.name" variant="outlined" class="mt-4" v-model="roomFormData.name" label="Название номера"/>
					<div  class="form__flex">
						<v-number-input
							v-model.number="roomFormData.places"
							label="Количество мест"
							type="number"
							variant="outlined"
							:rules="formRules.places"
						/>
						<v-number-input
							v-model.number="roomFormData.badCount"
							label="Количество комнат"
							type="number"
							variant="outlined"
							:rules="formRules.badCount"
						/>
					</div>
					<v-number-input
						v-model.number="roomFormData.extraPlaces"
						label="Количество дополнительных мест"
						type="number"
						variant="outlined"
					/>
					<v-text-field v-model="roomFormData.includedDescription" variant="outlined" label="Включено в стоимость (опционально)"></v-text-field>
					<v-number-input
						v-model.number="roomFormData.area"
						label="Площадь (в кв. метрах)"
						type="number"
						variant="outlined"
						:rules="formRules.area"
					/>
					<v-autocomplete
						variant="outlined"
						:items="roomsAmenities"
						v-model="roomFormData.amenities"
						label="Удобства"
						chips
						multiple
						clearable
						:rules="formRules.amenities"
					></v-autocomplete>
					<v-divider/>
					<FileUploader v-model="roomFormData.photos" class="mb-4"/>
					<v-divider/>
					<p class="hint mt-4">В котологе будет отображаться цена за самый дешевый номер.</p>
					<h3>Цены</h3>
					<p>Укажите минимальную цену, после чего добавьте периоды цен.</p>
					<v-text-field :rules="formRules.minPrice" variant="outlined" class="mt-4" type="number" v-model.number="roomFormData.minPrice" label="Минимальная цена"/>
					<h3>Периоды цен</h3>
					<p>Нужны для того, чтобы пользователь видел актуальную цену в зависимости от выбранных дат.</p>
					<PeriodsCreater v-model="roomFormData.pricePeriods"/>
					<v-divider class="mt-4"/>
					<BtnPrimary width="100%" class="mt-4" type="submit">Сохранить номер</BtnPrimary>
					<ul>
						<li
							style="color: red; margin-top: 16px; margin-left: 16px;"
							v-for="error of errors"
						>{{error}}</li>
					</ul>
				</v-form>
		</v-card>
	</v-dialog>
	
	<v-card title="Создание номеров" text="Загрузка номеров и заполнение всех полей обязательны" class="mt-4">
		<v-card-item>
			<BtnPrimary @click="roomFormModal = true">Добавить номер</BtnPrimary>
		</v-card-item>
	</v-card>
	
	<v-card
		elevation="0"
		v-for="room of listingFormData.rooms"
		:class="['room mt-8 ml-4 mr-4', {
			'no-photos': room.photos.length === 0
		}]"
		max-width="900px"
	>
		<div class="room__main">
			<v-carousel
				class="room__carousel"
				height="200px"
				hide-delimiters
				show-arrows="hover"
				v-if="room.photos.length > 0"
			>
				<v-carousel-item
					v-for="photo of room.photos"
					:src="photo.urlMin"
					cover
				></v-carousel-item>
			</v-carousel>
			<div class="room__info">
				<h3 class="room__title">{{room.name}}</h3>
				<div class="room__amenities">
					<span
						v-for="(amenity, index) of room.amenities"
						:class="['room__amenity', {
							'room__amenity_last': index === room.amenities.length - 1
						}]"
					>{{amenity}}</span>
				</div>
				<div class="listing-chips">
					<div class="chip">
						<BedIcon/>
						<span>
							{{getWordWithProperEnding( room.places, 'место')}}, {{room.extraPlaces + ' дополнительных'}}
						</span>
					</div>
					<div class="chip">
						<FitIcon/>
						<span>
							{{room.area}} м<sup>2</sup>
						</span>
					</div>
					<div class="chip">
						<RoomsIcon/>
						<span>
							{{getRoomString(room.badCount)}}
						</span>
					</div>
				</div>
				<div class="room__order order">
					<div class="order__info">
						<div class="order__price">
							<div class="price">от {{room.minPrice.toLocaleString('ru-RU')}} ₽</div>
							<span class="order__price_info">Цена за 1 ночь</span>
						</div>
					</div>
					
				</div>
				<div class="btns mt-4">
					<BtnPrimary
						@click="startRoomEdit(room)"
					>
						Редактировать
					</BtnPrimary>
					<BtnPrimary
						@click="deleteRoom(room.id)"
						color="red"
					>
						Удалить
					</BtnPrimary>
				</div>
				
			</div>
		</div>
	
	
	</v-card>

</template>

<style scoped lang="scss">

.hint {
	text-align: center;
	color: $text-gray;
}

.form__flex {
	display: flex;
	gap: 16px;
	@media screen and (max-width: 500px) {
		flex-direction: column;
	}
}

.room-create-form {
	padding: 16px;
}

@media screen and (max-width: 640px) {
	.room {
		&__main {
			grid-template-columns: 1fr !important;
		}
	}
}

.chip {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 14px;
	border-radius: 999px;
	color: #626262;
	background: #F1F3F9;
	padding: 3px 12px;
}

.rooms__title {
	margin-bottom: 16px;
}

.room {
	&.no-photos &__main {
		display: block !important;
	}
	
	&__main {
		display: grid;
		grid-template-columns: 250px 1fr;
		gap: 16px;
	}
	&__title {
		margin-bottom: 8px;
	}
	
	&__carousel {
		height: 200px;
		border-radius: 7px;
	}
	&__amenities {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 16px;
	}
	&__amenity {
		color: $text-gray;
		//margin-right: 8px;
		display: flex;
		align-items: center;
		font-size: 14px;
		&:not(&_last)::after {
			align-items: center;
			content: "·";
			display: flex;
			height: 14px;
			font-size: 20px;
			justify-content: center;
			left: -14px;
			width: 14px;
		}
	}
}

.order {
	display: flex;
	margin-top: 16px;
	justify-content: space-between;
	align-items: center;
	.price {
		font-weight: bold;
		font-size: 20px;
	}
}




</style>