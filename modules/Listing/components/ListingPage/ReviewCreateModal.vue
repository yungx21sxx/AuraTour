<script setup lang="ts">
	import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";
	import type {IReviewResponse} from "~/modules/Listing/types/response.types";
	import type {ReviewCreateDTO} from "~/modules/Listing/types/dto.types";
	import {mdiCalendarMonthOutline, mdiClose} from "@mdi/js"
	import {formatDate} from "../../utils/dates";
	import DateRangePickModal from "~/modules/Common/UI/DateRangePickModal.vue";
	import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
	import {ref} from "vue";
	import {ReviewsApi} from "~/modules/Listing/api/reviews.api";
	import type {H3Error} from "h3";
	import useListing from "~/modules/Listing/composables/useListing";
	
	const authUser = useAuthUser();
	
	const isLoading = ref(false);
	const serverErrors = ref<string[]>([]);
	const isOpen = defineModel<boolean>('isOpen');
	const emits = defineEmits<{
		onSave: () => void
	}>();
	
	
	const {reviewToUpdate, isAdmin, reviewId} = defineProps<{
		reviewToUpdate: ReviewCreateDTO | null,
		isAdmin: boolean,
		reviewId: number | null
	}>();
	
	const {listing} = useListing()
	
	const formRef = ref();
	const createDate = ref<Date>(new Date());
	const ratingInput = ref<number>( 5);
	const datePickerModal = ref(false);
	const nameInput = ref( '');
	const textInput = ref( '');
	
	const dateRange = ref<{start: Date | null, end: Date | null}>({
		start: null,
		end: null,
	});
	
	watch(() => reviewToUpdate, (review: ReviewCreateDTO) => {
		if (!review) {
			createDate.value = new Date();
			ratingInput.value = 5;
			nameInput.value = '';
			textInput.value = '';
			
			dateRange.value = {
				start: null,
				end: null,
			}
			return;
		}
		
		createDate.value = review.createdAt;
		ratingInput.value = review.rating;
		nameInput.value = review.userName;
		textInput.value = review.text;
		
		dateRange.value = {
			start: review.listingCheckIn,
			end: review.listingCheckOut,
		}
		
	})
	
	const nameRules = [
		(v: string) => (!!v) || 'Придумаете имя.',
	];
	

	const textRules = [
		(v: string) => !!v || 'Поле обязательно для заполнения',
	]
	
	const {isMobile} = useDevice();
	
	const submit = async () => {
		if (formRef.value) {
			const { valid } = await formRef.value.validate();
			if (!valid) {
				return;
			}
		} else {
			console.error('Form ref is not defined');
			return;
		}
		isLoading.value = true;
		serverErrors.value = [];
		if (dateRange.value.start && dateRange.value.end) {
			serverErrors.value = ['Не выбранны даты проживания.'];
		}
		try {
			const {success, review} = await ReviewsApi.createOrUpdateReview(
				reviewToUpdate ? 'UPDATE' : 'CREATE',
				isAdmin,
				{
					text: textInput.value,
					rating: ratingInput.value,
					userName: nameInput.value,
					createdAt: createDate.value,
					listingCheckIn: dateRange.value.start,
					listingCheckOut: dateRange.value.end,
					listingId: listing.value.id
				},
				reviewId
			)
			emits('onSave');
		} catch (error: H3Error) {
			if (error && error.data) {
				serverErrors.value = [error.data.message];
			} else {
				serverErrors.value = ['Произошла ошибка на стороне сервера.'];
			}
		} finally {
			isLoading.value = false;
		}
	}
	
	
	
</script>

<template>
	<v-dialog v-model="isOpen" :fullscreen="isMobile" :max-width="500">
		
		<v-card>
			<v-toolbar>
				<v-btn :icon="mdiClose" @click="isOpen = false"/>
				<v-toolbar-title>
					Оставить отзыв
				</v-toolbar-title>
			</v-toolbar>
			<v-card-item>
				<v-form ref="formRef" @submit.prevent="submit">
					<v-text-field v-model="nameInput" :rules="nameRules" v-if="isAdmin" label="Придумайте имя"/>
					<v-date-input
						label="Когда был оставлен отзыв?"
						:prepend-icon="mdiCalendarMonthOutline"
						v-model="createDate"
						v-if="isAdmin"
					></v-date-input>
					<v-textarea v-model="textInput" :rules="textRules" label="Текст отзыва"/>
					<v-card class="dates" @click="datePickerModal = true">
						<v-icon :icon="mdiCalendarMonthOutline"></v-icon>
						<span v-if="dateRange.start && dateRange.end">{{formatDate(dateRange.start)}} - {{formatDate(dateRange.end)}}</span>
						<span v-else>Выберите даты проживания</span>
					</v-card>
					<div class="rating">
						<span>
							Поставьте оценку:
						</span>
						<v-rating
							color="yellow-darken-3"
							v-model="ratingInput"
							density="comfortable"
							half-increments
						/>
					</div>
					<BtnPrimary
						type="submit"
						:loading="isLoading"
						class="mt-6"
						block
					>Оставить отзыв</BtnPrimary>
					<div v-if="serverErrors.length > 0" style="color: red; margin-top: 16px;">
						<ul>
							<li v-for="(error, index) in serverErrors" :key="index">
								{{ error }}
							</li>
						</ul>
					</div>
				</v-form>
			</v-card-item>
			
		</v-card>
	</v-dialog>
	<DateRangePickModal v-model:range="dateRange" v-model:is-open="datePickerModal"/>
</template>

<style scoped lang="scss">

	.dates {
		width: 100%;
		background: #F0F3F7 !important;
		border-radius: 8px;
		box-shadow: none !important;
		padding: 12px 12px;
		display: flex;
		align-items: center;
		gap: 8px;
		color: #333D46;
	}
	.rating {
		display: flex;
		gap: 16px;
		align-items: center;
		margin-top: 24px;
	}

</style>