<script setup lang="ts">
	import useBooking from "~/modules/Booking/composables/useBooking";
	import useListingBooking from "~/modules/Listing/composables/useListingBooking";
	import {mdiArrowLeftCircleOutline} from "@mdi/js";
	
	const { beautifyDate, calculateDaysBetweenDates} = useBooking();
	const {dateModal, closeSetDateModal} = useListingBooking();
	const {isMobileOrTablet} = useDevice();
	import {DatePicker} from "v-calendar";
	
	const range = ref({
		start: dateModal.value.checkIn,
		end: dateModal.value.checkOut
	});
	const error = ref(false)
	function save() {
		if (!range.value.start || !range.value.end) {
			error.value = true;
			return;
		}
		error.value = false;
		closeSetDateModal(range.value.start, range.value.end)
	}
	
	
</script>
<template>
	<v-dialog v-model="dateModal.isOpen" :fullscreen="isMobileOrTablet" width="600px">
		<v-card>
			<v-card-item>
				<div :class="['modal', {
					'modal_desktop' : !isMobileOrTablet,
					'modal_mobile': isMobileOrTablet
				}]">
					<div class="modal__header header">
						<div class="header__title">
							<v-btn color="#7059FF" :icon="mdiArrowLeftCircleOutline" @click="closeSetDateModal" variant="tonal"/>
							<h3>Выберите даты</h3>
						</div>
						<div class="header__dates dates" v-if="!range.start && !range.end">
							<h2 class="header__date">
								Заезд
							</h2>
							<p>Введите даты поездки чтобы увидеть цены</p>
						</div>
						<div class="header__dates" v-else>
							<h2 class="header__date">
								{{beautifyDate(range.start || new Date)}} - {{beautifyDate(range.end || new Date)}}
							</h2>
							<p>{{calculateDaysBetweenDates(range.start || new Date(), range.end || new Date())}}</p>
						</div>
						
					</div>
					
					<div class="modal__date">
						<DatePicker
							v-model.range="range"
							:min-date="new Date()"
							expanded
							:rows="isMobileOrTablet ? 12 : 1"
							:columns="isMobileOrTablet ? 1 : 2"
						/>
					</div>
					<v-btn class="modal__footer" color="#7059FF" @click="save">Сохранить</v-btn>
				</div>
			</v-card-item>
		</v-card>
	</v-dialog>
</template>

<style scoped lang="scss">
.header__title {
	display: flex;
	align-items: center;
	background: #FFFFFF;
	gap: 32px;
}


.header__dates {
	margin-top: 8px;
	margin-bottom: 16px;
	
}

.modal_mobile {
	.modal__date {
		max-height: calc(100svh - 16px - 116px - 85px);
		overflow-y: scroll;
	}
}

.modal__footer {
	max-width: 400px;
	width: 100%;
	margin: 16px auto;
	display: block;
	
}





</style>