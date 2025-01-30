<script setup lang="ts">
import TextEditor from "~/modules/Common/UI/TextEditor.vue";
import useCreateListing from "~/modules/Admin/ListingCRUD/composables/useCreateListing";
import SetLocation from "~/modules/Admin/ListingCRUD/components/SetLocation.vue";
import FileUploader from "~/modules/Admin/ListingCRUD/components/FileUploader.vue";
import PeriodsCreater from "~/modules/Admin/ListingCRUD/components/PeriodsCreater.vue";
import CreateRooms from "~/modules/Admin/ListingCRUD/components/CreateRooms.vue";
import {beautifyDate} from "~/modules/Common/Utils/dates.utils";
import SetManager from "~/modules/Admin/ListingCRUD/components/SetManager.vue";
import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import VideoUploader from "~/modules/Admin/ListingCRUD/components/VideoUploader.vue";

const authUser = useAuthUser();

const isAdminOrManager = computed(() => ['ADMIN', 'MANAGER'].includes(authUser.value?.role))

definePageMeta({
	layout: 'admin',
	middleware: ['admin-only'],
});


const {listingFormData, initialData, fetchInitialData, createListing, validationFail, roomsDontAdded, errorMassages} = useCreateListing()


await fetchInitialData()


const isHotelType = computed<boolean>(() => {
	return listingFormData.value.typeId ? [2, 6, 8].includes(listingFormData.value.typeId) : false
})

watch(listingFormData, () => {
	localStorage.setItem('listingFormData',JSON.stringify(listingFormData.value))
}, {deep: true});


onMounted(() => {
	const listingFormDataJSON = localStorage.getItem('listingFormData')
	if (!listingFormDataJSON) return;

	const listingFormDataFromLocalStore = JSON.parse(listingFormDataJSON);

	const {rooms, pricePeriods, ...dto} = listingFormDataFromLocalStore;
	
	listingFormData.value = {
		...dto,
		rooms: rooms.map(room => {
			const {pricePeriods, ...roomData} = room
			return {...roomData, pricePeriods: []}
		}),
		pricePeriods: []
	}
})

</script>

<template>
	<div class="create mt-8">
			<v-form ref="form">
				<v-card>
					<v-card-item>
						<h2 class="mb-4">Cоздать объект</h2>
						<v-select variant="outlined" density="default" :items="initialData.housingTypes" v-model="listingFormData.typeId" item-title="name"
						          item-value="id" label="Тип жилья" required></v-select>
						<v-text-field variant="outlined" v-model="listingFormData.title" label="Заголовок" required clearable></v-text-field>
						<TextEditor title="Введите описание" v-model="listingFormData.description"/>
						<p class="mb-2">Выберите или введите название города</p>
						<v-autocomplete variant="outlined" :items="initialData.cities" v-model="listingFormData.cityId" item-title="name"
						                item-value="id" label="Город" required></v-autocomplete>
					</v-card-item>
				</v-card>
				
				<SetManager v-if="isAdminOrManager"/>
				
				<SetLocation/>
				<FileUploader v-model="listingFormData.photos"/>
<!--				<VideoUploader v-model="listingFormData.videos"/>-->
				
				<v-alert type="warning" v-if="!listingFormData.typeId" class="mt-4" text="Выберите тип жилья, для того чтобы ввести параметры объекта."/>
				<v-card v-else class="mt-4" title="Параметры объекта">
					<v-card-item>
						<div class="form__flex mt-2" v-if="!isHotelType">
							<v-text-field
								v-model.number="listingFormData.places"
								label="Количество спальных мест"
								type="number"
								variant="outlined"
							/>
							<v-text-field
								v-model.number="listingFormData.badCount"
								label="Количество комнат"
								type="number"
								variant="outlined"
							/>
							<v-text-field
								v-model.number="listingFormData.area"
								label="Площадь (в кв. метрах)"
								type="number"
								variant="outlined"
							/>
						</div>
						<div class="form__flex" v-if="!isHotelType && listingFormData.typeId === 1">
							<v-text-field
								v-model.number="listingFormData.flatProperties.floor"
								label="Этаж"
								type="number"
								variant="outlined"
							/>
							<v-text-field
								v-model.number="listingFormData.flatProperties.maxFloor"
								label="Всего этажей"
								type="number"
								variant="outlined"
							/>
							<v-switch
								v-model.number="listingFormData.flatProperties.elevator"
								color="blue"
								label="Лифт"
							/>
						</div>
						
						<div class="form__flex">
							<v-text-field v-model.number="listingFormData.minDaysOrder"
							              label="Минимальное количество дней проживания"
							              type="number"
							              required
							              variant="outlined"
							/>
							<v-text-field v-model.number="listingFormData.seaDistance"
							              label="Расстояние до моря (в метрах)"
							              type="number"
							              required
							              variant="outlined"
							/>
						</div>
						<v-select chips :items="initialData.amenities" v-model="listingFormData.amenities" item-title="name" item-value="id"
						          label="Удобства" multiple required variant="outlined"></v-select>
						<v-label class="mb-4">Нужно указывать для корректной фильтрации жилья в каталоге</v-label>
						<v-select chips :items="initialData.foodOptions" v-model="listingFormData.foodOptions" item-title="name" item-value="id"
						          label="Типы питания" multiple required variant="outlined"></v-select>
						<v-textarea v-model="listingFormData.foodDescription" variant="outlined" v-if="isHotelType" label="Описание питания"></v-textarea>
						<v-select chips :items="initialData.infrastructure" v-model="listingFormData.infrastructure" item-title="name" item-value="id"
						          label="Инфраструктура (необязательно)" multiple variant="outlined"></v-select>
					</v-card-item>
				</v-card>
				
				<v-card class="set-price-listingFormData mt-4" v-if="!isHotelType">
					<v-card-title>Цены</v-card-title>
					<v-card-text>Укажите минимальную цену, после чего добавьте периоды цен.</v-card-text>
					<v-card-item>
						<v-text-field variant="outlined" class="mt-1" v-model.number="listingFormData.minPrice" type="number" label="Минимальная цена"/>
					</v-card-item>
					<v-card-title>Периоды цен</v-card-title>
					<v-card-text>Нужны для того, чтобы пользователь видел актуальную цену в зависимости от выбранных дат.</v-card-text>
					<PeriodsCreater v-model="listingFormData.pricePeriods"/>
				</v-card>
				<CreateRooms v-else-if="isHotelType"/>
				
				<BtnPrimary v-if="isAdminOrManager" class="mt-8" width="100%"  @click="createListing(authUser.role)">Сохранить объект</BtnPrimary>
				<BtnPrimary v-else class="mt-8 mb-4" width="100%" @click="createListing(authUser.role)">Отправить на модерацию</BtnPrimary>
				
				<div v-if="errorMassages.length > 0">
					<h4 class="mb-2 mb-4">Не заполенны следующие поля:</h4>
					<ul class="mb-8">
						<li
							v-for="error of errorMassages"
						>{{error}}</li>
					</ul>
				</div>
			</v-form>
		</div>
</template>

<style scoped lang="scss">


.form__flex {
	display: flex;
	gap: 16px;
}


@media screen and (max-width: 500px) {
	.form__flex {
		flex-direction: column;
		gap: 0;
	}
	//.create {
	//	margin-left: -16px;
	//	margin-right: -16px;
	//}
	
}



</style>