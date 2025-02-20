<script setup lang="ts">
	import {DatePicker} from "v-calendar";
	import useBooking from "~/modules/Booking/composables/useBooking";
	import {mdiArrowLeftCircleOutline} from "@mdi/js";
	
	const {isMobileOrTablet} = useDevice();
	interface IDateRange {
		start: Date,
		end: Date
	}
	const { beautifyDate} = useBooking();
	
	const range = defineModel<IDateRange>('range', {required: true});
	const isOpen = defineModel<boolean>('isOpen', {required: true});
	
</script>

<template>
	<v-dialog v-model="isOpen" :fullscreen="isMobileOrTablet" width="600px" min-height="600px">
		<v-card>
			<v-card-item>
				<div :class="['modal', {
					'modal_desktop' : !isMobileOrTablet,
					'modal_mobile': isMobileOrTablet
				}]">
					<div class="modal__header header">
						<div class="header__title">
							<v-btn color="#7059FF" :icon="mdiArrowLeftCircleOutline" @click="isOpen = false" variant="tonal"/>
							<h3>Выберите даты</h3>
						</div>
						<div class="header__dates dates" v-if="!range.start && !range.end">
						
						</div>
						<div class="header__dates" v-else>
							<h2 class="header__date">
								{{beautifyDate(range.start || new Date())}} - {{beautifyDate(range.end || new Date())}}
							</h2>
						</div>
					
					</div>
					
					<div class="modal__date">
						<DatePicker
							v-model.range="range"
							expanded
							:rows="isMobileOrTablet ? 1 : 1"
							:columns="isMobileOrTablet ? 1 : 2"
						/>
					</div>
					<v-btn class="modal__footer" color="#7059FF" @click="isOpen = false">Сохранить</v-btn>
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