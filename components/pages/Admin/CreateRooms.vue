<script setup lang="ts">
	import useCreateListing from "~/components/pages/Admin/useCreateListing";
	import type {RoomCreateDTO} from "~/types/dto.types";
	import FileUploader from "~/components/pages/Admin/FileUploader.vue";
	import PeriodsCreater from "~/components/pages/Admin/PeriodsCreater.vue";
	
	const {listingDTO, useRooms} = useCreateListing();
	
	const rooms = useRooms();
	
	defineProps<{
		edit?: boolean
	}>()
	
	const roomDefault = {
		name: '',
		places: 2,
		area: 0,
		badCount: 1,
		minPrice: 0,
		pricePeriods: [],
		amenities: [],
		photos: []
	}
	let roomFormData = ref<RoomCreateDTO>(structuredClone(roomDefault));
	
	const createRoom = () => {
		rooms.value.push(roomFormData.value);
		roomFormData.value = structuredClone(roomDefault)
		
		const minRoomPrice = Math.min.apply(null, rooms.value.map(i => i.minPrice));
		listingDTO.value.minPrice = minRoomPrice;
	}
	
	const roomsAmenities = ['Кондиционер', 'Телевизор', 'Wi-Fi', 'Душ и туалет в номере', 'Душ и туалет на этаже', 'Фен', 'Письменный стол', 'Стенной шкаф или гардероб','Холодильник', 'Вид на море', 'Вид на горы', 'Вид на город', 'Балкон / Терраса']
	console.log(rooms.value)
</script>

<template>
	<v-card class="mt-4">
		<v-card-item title="Создать номер">
			<v-form @submit.prevent="createRoom">
				<v-text-field class="mt-4" v-model="roomFormData.name" label="Название номера"/>
				<div  class="form__flex mt-4">
					<v-text-field
						v-model.number="roomFormData.places"
						label="Количество мест"
						type="number"
					/>
					<v-text-field
						v-model.number="roomFormData.badCount"
						label="Количество комнат"
						type="number"
					/>
					<v-text-field
						v-model.number="roomFormData.area"
						label="Площадь (в кв. метрах)"
						type="number"
					/>
				</div>
				<v-autocomplete
					variant="outlined"
					:items="roomsAmenities"
					v-model="roomFormData.amenities"
					label="Удобства"
					chips
					multiple
					clearable
				></v-autocomplete>
				<v-divider/>
				<FileUploader v-model="roomFormData.photos" class="mb-4"/>
				<v-text-field class="mt-4" type="number" v-model.number="roomFormData.minPrice" label="Минимальная цена"/>
				<v-divider/>
				<PeriodsCreater v-model="roomFormData.pricePeriods"/>
				<v-divider class="mt-4"/>
				<v-btn  color="#FAAC37" width="100%" class="mt-4" type="submit">Сохранить номер</v-btn>
				<p class="hint mt-4">Цена и максимальная вместительность рассчитываються автоматически на основе сохраненных номеров.</p>
			</v-form>
		</v-card-item>
	</v-card>
	
	<v-card
		v-for="(room, index) of rooms"
		class="mt-4"
	>
		<v-card-title>
			<h3 class="mb-2">{{room.name}}</h3>
			
		</v-card-title>
		<v-card-item>
			<v-text-field class="pt-2" v-model="room.name" label="Название номера"></v-text-field>
			<div class="form__flex mt-4" v-if="edit">
				
				<v-text-field
					v-model.number="room.places"
					label="Количество мест"
					type="number"
				/>
				<v-text-field
					v-model.number="room.badCount"
					label="Количество кроватей"
					type="number"
				/>
				<v-text-field
					v-model.number="room.area"
					label="Площадь (в кв. метрах)"
					type="number"
				/>
			</div>
			<v-chip-group v-else>
				<v-chip prepend-icon="mdi-ruler-square-compass">{{room.area}} м <sup>2</sup></v-chip>
				<v-chip prepend-icon="mdi-bed-outline">{{room.badCount}} кровать</v-chip>
				<v-chip prepend-icon="mdi-account-outline">{{room.places}} места</v-chip>
			</v-chip-group>
			<h4 class="mb-4">Удобства</h4>
			<v-combobox
				:items="roomsAmenities"
				v-model="room.amenities"
				variant="outlined"
				label="Удобства"
				chips
				multiple
				clearable
				v-if="edit"
			></v-combobox>
			<v-chip
				v-else
				v-for="amenity of room.amenities"
			>{{amenity}}</v-chip>
			<v-divider class="mb-4 mt-4"/>
			<v-text-field
				v-model.number="room.minPrice"
				label="Минимальная цена"
				type="number"
				v-if="edit"
			/>
			<h4 v-else>Минимальная цена: {{room.minPrice}}</h4>
			
			<PeriodsCreater v-model="room.pricePeriods"/>
			<FileUploader v-model="room.photos"/>
			<v-btn color="red" @click="rooms.splice(index, 1)">Удалить</v-btn>
		</v-card-item>
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


</style>