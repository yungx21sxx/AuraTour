<script setup lang="ts">
import TextEditor from "~/modules/Common/UI/TextEditor.vue";
import type {RoomCreateDTO} from "~/types/dto.types";
import useBooking from "~/modules/Booking/composables/useBooking";
import useCreateListing from "~/modules/Admin/ListingCRUD/composables/useCreateListing";
import SetLocation from "~/modules/Admin/ListingCRUD/components/SetLocation.vue";
import FileUploader from "~/modules/Admin/ListingCRUD/components/FileUploader.vue";
import PeriodsCreater from "~/modules/Admin/ListingCRUD/components/PeriodsCreater.vue";
import CreateRooms from "~/modules/Admin/ListingCRUD/components/CreateRooms.vue";
import SetManager from "~/modules/Admin/ListingCRUD/components/SetManager.vue";


const route = useRoute()
const {listingFormData, fetchListingUpdateData, initialData, fetchInitialData, setPhoneRaw, updateListing, rooms, createListing, createOrUpdateError} = useCreateListing()
const {beautifyDate} = useBooking();

await fetchInitialData()
await fetchListingUpdateData(parseInt(route.params.id as string))

const isHotelType = computed<boolean>(() => {
	return listingFormData.value.typeId ? [2, 6, 8].includes(listingFormData.value.typeId) : false
})

</script>

<template>
	<div class="create mt-8">
		<v-form ref="form">
			<v-card>
				<v-card-item>
					<h2 class="mb-4">Редактировать объект</h2>
					<v-select variant="outlined" density="default" :items="initialData.housingTypes" v-model="listingFormData.typeId" item-title="name"
					          item-value="id" label="Тип жилья" required></v-select>
					<v-text-field variant="outlined" v-model="listingFormData.title" label="Заголовок" required clearable></v-text-field>
					<TextEditor title="Введите описание" v-model="listingFormData.description"/>
					<p class="mb-2">Выберите или введите название города</p>
					<v-autocomplete variant="outlined" :items="initialData.cities" v-model="listingFormData.cityId" item-title="name"
					                item-value="id" label="Город" required></v-autocomplete>
				</v-card-item>
			</v-card>
			
			<SetManager/>
			
			<SetLocation/>
			<FileUploader v-model="listingFormData.photos"/>
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
					<v-select chips :items="initialData.foodOptions" v-model="listingFormData.foodOptions" item-title="name" item-value="id"
					          label="Типы питания" multiple required variant="outlined"></v-select>
				
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
			
			<v-btn class="mt-8" width="100%" color="blue" @click="updateListing">Сохранить объект</v-btn>
</v-form>
</div>
</template>

<style scoped lang="scss">
.form__flex {
	display: flex;
	gap: 16px;
	@media screen and (max-width: 500px) {
		flex-direction: column;
	}
}

@media screen and (max-width: 500px) {
	.form__flex {
		flex-direction: column;
		gap: 0;
	}
}

</style>