<script setup lang="ts">
import TextEditor from "~/components/pages/Admin/TextEditor.vue";
import type {RoomCreateDTO} from "~/types/dto.types";
import useBooking from "~/components/Booking/useBooking";
import useCreateListing from "~/components/pages/Admin/useCreateListing";
import SetLocation from "~/components/pages/Admin/SetLocation.vue";
import FileUploader from "~/components/pages/Admin/FileUploader.vue";
import PeriodsCreater from "~/components/pages/Admin/PeriodsCreater.vue";
import CreateRooms from "~/components/pages/Admin/CreateRooms.vue";

definePageMeta({
	layout: 'admin',
	middleware: ['admin-only'],
})

const {listingDTO, initialData, fetchInitialData, setPhoneRaw, createListing, validationFail, roomsDontAdded} = useCreateListing()
const {beautifyDate} = useBooking();

await fetchInitialData()


const isGuestHouse = computed<boolean>(() => {
	return listingDTO.value?.typeId === 2 || listingDTO.value?.typeId === 6 || listingDTO.value?.typeId === 8
})



</script>

<template>
	<client-only>
		<div class="create mt-8">
			<v-form ref="form">
				<v-card title="Создать объект">
					<v-card-item>
						<v-text-field v-model="listingDTO.title" label="Заголовок" required></v-text-field>
						<TextEditor v-model="listingDTO.description"/>
						
						<v-autocomplete variant="outlined" :items="initialData.cities" v-model="listingDTO.cityId" item-title="name"
						                item-value="id" label="Город" required></v-autocomplete>
						
						<v-select variant="outlined" density="default" :items="initialData.housingTypes" v-model="listingDTO.typeId" item-title="name"
						          item-value="id" label="Тип жилья" required></v-select>
<!--						<p class="mt-2">Тип жилья изменить будет невозможно</p>-->
					</v-card-item>
				</v-card>
				
				<SetLocation/>
				<FileUploader v-model="listingDTO.photos"/>
					
				<v-card v-if="!isGuestHouse" class="mt-4">
					<v-card-item>
						<div class="form__flex mt-4">
							<v-text-field
								v-model.number="listingDTO.places"
								label="Количество мест"
								type="number"
							/>
							<v-text-field
								v-model.number="listingDTO.badCount"
								label="Количество комнат"
								type="number"
							/>
							<v-text-field
								v-model.number="listingDTO.area"
								label="Площадь (в кв. метрах)"
								type="number"
							/>
						</div>
						<div class="form__flex mt-4">
							<v-text-field
								v-model.number="listingDTO.floor"
								label="Этаж"
								type="number"
							/>
							<v-text-field
								v-model.number="listingDTO.maxFloor"
								label="Всего этажей"
								type="number"
							/>
							<v-switch
								v-model.number="listingDTO.elevator"
								label="Лифт"
							/>
						</div>
					</v-card-item>
				</v-card>
				
				<v-card class="mt-4">
					<v-card-item>
						<div class="form__flex mt-4">
							<v-text-field v-model.number="listingDTO.minDaysOrder"
							              label="Минимальное количество дней для заказа"
							              type="number"
							              required
							/>
							<v-text-field v-model.number="listingDTO.seaDistance"
							              label="Расстояние до моря (в метрах)"
							              type="number"
							              required
							/>
						</div>
						
						<v-text-field v-model="listingDTO.renterName" label="Имя владельца"/>
						<PhoneInput v-model="listingDTO.phone" @updateRowValue="setPhoneRaw" required/>
						
						<v-select chips :items="initialData.amenities" v-model="listingDTO.amenities" item-title="name" item-value="id"
						          label="Удобства" multiple required></v-select>
						<v-select chips class="mt-4 mb-4" :items="initialData.foodOptions" v-model="listingDTO.foodOptions" item-title="name" item-value="id"
						          label="Типы питания" multiple required></v-select>
					</v-card-item>
				</v-card>
					
					
				<v-card class="set-price-listingDTO mt-4" v-if="!isGuestHouse">
					<v-card-item>
						<v-text-field class="mt-4" v-model.number="listingDTO.minPrice" type="number" label="Минимальная цена"/>
						<PeriodsCreater v-model="listingDTO.pricePeriods"/>
					</v-card-item>
				</v-card>
				<CreateRooms v-else/>
				<v-btn class="mt-8" width="100%" color="blue" @click="createListing">Сохранить объект</v-btn>
				<v-alert
					v-if="validationFail"
					class="mt-4"
					color="error"
					icon="$error"
					title="Заполните всю информацию"
					variant="tonal"
				></v-alert>
				<v-alert
					v-if="roomsDontAdded"
					class="mt-4"
					color="error"
					icon="$error"
					title="Вы не добавили номера"
					variant="tonal"
				></v-alert>
			</v-form>
		</div>
	</client-only>
</template>

<style scoped lang="scss">



.form__flex {
	display: flex;
	gap: 16px;
	@media screen and (max-width: 500px) {
		flex-direction: column;
	}
}




</style>