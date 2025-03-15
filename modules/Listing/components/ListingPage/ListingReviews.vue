<script setup lang="ts">
	import useListing from "~/modules/Listing/composables/useListing";
	import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
	import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";
	import type {IReviewResponse} from "~/modules/Listing/types/response.types";
	import {mdiCalendarMonthOutline, mdiDeleteForeverOutline, mdiPencil, mdiAccountOutline} from "@mdi/js"
	import ReviewCreateModal from "~/modules/Listing/components/ListingPage/ReviewCreateModal.vue";
	import {ReviewsApi} from "~/modules/Listing/api/reviews.api";
	import type {ReviewCreateDTO} from "~/modules/Listing/types/dto.types";
	import useAuthModal from "~/modules/Auth/composables/useAuthModal";
	
	const {listing} = useListing();
	const authUser = useAuthUser();
	
	const isAdmin = computed(() => {
		if (authUser.value) {
			return ['MANAGER', 'ADMIN'].includes(authUser.value.role)
		}
		return false
	})
	
	const {openAuthModal} = useAuthModal()
	
	const {data: reviews, refresh} = await useAsyncData<IReviewResponse[]>('reviews', () => ReviewsApi.fetchReviews(listing.value.id));
	
	const reviewsParams = computed(() => ({
		averageRating:  reviews.value.reduce((acc, review) => acc + review.rating, 0) / reviews.value.length,
		reviewsCount: reviews.value.length
	}))
	const isReviewCreateModalOpen = ref(false);
	const reviewToUpdateData = ref<ReviewCreateDTO | null>(null);
	const reviewToUpdateId = ref<number | null>(null)
	
	function formatDate(date: Date) {
		return (new Date(date)).toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		});
	}
	
	function formatDateRange(date1, date2) {
		// Убедимся, что date1 всегда раньше date2
		if (date1 > date2) [date1, date2] = [date2, date1];
		
		// Рассчитаем количество дней между датами
		const timeDifference = date2 - date1;
		const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
		
		// Получаем месяц и год с наибольшим количеством дней
		const month1 = date1.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
		const month2 = date2.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
		
		// Определим наибольший месяц по количеству дней
		const chosenMonth = month1 === month2 ? month1 : daysDifference > 15 ? month2 : month1;
		
		// Формируем итоговую строку
		return `${chosenMonth.charAt(0).toUpperCase() + chosenMonth.slice(1)}, ${daysDifference} суток`;
	}
	
	function startEditReview(review: IReviewResponse) {
		if (!authUser && authUser.value.id !== review.user?.id) {
			return;
		}
		reviewToUpdateId.value = review.id
		reviewToUpdateData.value = {
			userName: review.userName,
			rating: review.rating,
			text: review.text,
			listingCheckIn: review.listingCheckIn,
			listingCheckOut: review.listingCheckOut,
			createdAt: review.createdAt,
			listingId: listing.value.id
		}
		isReviewCreateModalOpen.value = true;
	}
	
	function createReview() {
		reviewToUpdateData.value = null;
		isReviewCreateModalOpen.value = true;
	}
	
	async function onReviewSave() {
		await refresh();
		isReviewCreateModalOpen.value = false;
	}
	
	const deleteReviewSnackBar = ref(false);
	const reviewToDeleteId = ref<number | null>(null)
	
	function openDeleteConfirmSnackBar(reviewID: number) {
		deleteReviewSnackBar.value = true
		reviewToDeleteId.value = reviewID
	}
	
	async function deleteReview() {
		await ReviewsApi.deleteReview(reviewToDeleteId.value);
		deleteReviewSnackBar.value = false;
		reviewToDeleteId.value = null;
		await refresh();
	}
	
</script>

<template>
	<div>
		<ReviewCreateModal
			v-model:is-open="isReviewCreateModalOpen"
			:is-admin="isAdmin"
			:review-to-update="reviewToUpdateData"
			:review-id="reviewToUpdateId"
			@onSave="onReviewSave"
		/>
		<div class="reviews listing-block">
			<div class="rating">
				<h3>Отзывы гостей</h3>
				<div class="reviews-info" v-if="listing.reviewCount > 0">
					<span class="average">{{reviewsParams.averageRating}}</span>
					<span class="count">{{getWordWithProperEnding(reviewsParams.reviewsCount, 'отзыв')}}</span>
				</div>
				<span class="count" v-else>Нет отзывов</span>
			</div>
			<div class="header mt-4 mb-8">
				<p v-if="authUser">Отдыхали здесь? Поделитесь впечатлениями!</p>
				<p v-else>Войдите или зарегестрируйтесь, чтобы оставить отзыв.</p>
				<BtnPrimary @click="createReview" v-if="authUser">
					Оставить отзыв
				</BtnPrimary>
				<BtnPrimary v-else @click="openAuthModal">Войти</BtnPrimary>
			</div>
			<div class="review mb-4" v-for="review of reviews" :key="review.id">
				<v-avatar color="#7059FF" size="large">
					{{review.isAdminCreated ? review.userName[0] : review.user.name[0] }}
				</v-avatar>
				<div class="review__main">
					<v-chip v-if="isAdmin && review.isAdminCreated">Не настоящий</v-chip>
					<v-chip-group v-if="isAdmin || (authUser && authUser.id === review?.user?.id)">
						<v-chip
							:prepend-icon="mdiPencil"
							@click="startEditReview(review)"
						>Редактировать</v-chip>
						<v-chip
							:prepend-icon="mdiDeleteForeverOutline"
							@click="openDeleteConfirmSnackBar(review.id)"
						>Удалить</v-chip>
						<v-chip v-if="isAdmin && !review.isAdminCreated" :prepend-icon="mdiAccountOutline">Профиль пользователя</v-chip>
					</v-chip-group>
					<div class="review__header review__header_desktop">
						<div class="review__info">
							<div class="review__name">{{review.isAdminCreated ? review.userName : review.user.name }}</div>
							<div class="review__period mt-1">
								<v-icon color="#6A6D81FF" size="16px" :icon="mdiCalendarMonthOutline"/>
								<span>
								{{formatDateRange(new Date(review.listingCheckIn), new Date(review.listingCheckOut))}}
							</span>
							</div>
						</div>
						<div class="review__rating">
							<v-rating
								color="yellow-darken-3"
								v-model="review.rating"
								density="compact"
								half-increments
								readonly
							></v-rating>
							<span>{{formatDate(review.createdAt)}}</span>
						</div>
					</div>
					<div class="review__header review__header_mobile">
						<div class="review__info">
							<div class="review__name">{{review.isAdminCreated ? review.userName : review.user.name }}</div>
							<span class="review__date">{{formatDate(review.createdAt)}}</span>
							<div class="review__period mt-2">
								<v-icon color="#6A6D81FF" size="16px" :icon="mdiCalendarMonthOutline"/>
								<span>
								{{formatDateRange(new Date(review.listingCheckIn), new Date(review.listingCheckOut))}}
							</span>
							</div>
						</div>
						<div class="review__rating">
							<span class="average" style="width: fit-content">{{review.rating.toFixed(1)}}</span>
						</div>
					</div>
					<p class="review__text mt-4">
						{{review.text}}
					</p>
				</div>
			
			</div>
		
		</div>
		<v-snackbar
			v-model="deleteReviewSnackBar"
			multi-line
		>
			Точно хотите удалить?
			
			<template v-slot:actions>
				<v-btn
					color="red"
					variant="text"
					class="mr-5"
					@click="deleteReview"
				>
					Да
				</v-btn>
				<v-btn
					variant="text"
					@click="deleteReviewSnackBar = false"
				>
					Нет
				</v-btn>
			</template>
		</v-snackbar>
	</div>
	
</template>

<style scoped lang="scss">
	
	.review {
		display: flex;
		gap: 16px;
		
		&__main {
			width: 100%;
		}
		&__name {
			font-size: 20px;
			font-weight: 500;
		}
		
		&__period {
			display: flex;
			gap: 8px;
			align-items: center;
			font-size:  14px;
			color: $text-gray;
		}
		
		&__rating {
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
			gap: 8px;
			span {
				font-size: 14px;
				color: $text-gray;
			}
		}
		
		
		&__header_desktop {
			display: flex;
			justify-content: space-between;
		}
		&__header_mobile {
			display: none;
			.review__info {
				display: flex;
				flex-direction: column;
			}
			.review__name {
				font-size: 16px;
				font-weight: bold;
			}
			.review__date {
				font-size: 14px;
			}
		}
		@media screen and (max-width: 600px) {
			&__header_desktop {
				display: none;
			}
			&__header_mobile {
				display: flex;
				justify-content: space-between;
			}
			
		}
	}

	.reviews {
		h3 {
			font-size: 24px;
		}
		.rating, .header {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			gap: 10px;
			align-items: center;
		}
		.reviews-info {
			display: flex;
			align-items: center;
			gap: 8px;
		}
		.average {
			background: $accent-blue;
			padding: 0 16px;
			border-radius: 4px;
			color: #fff;
		}
		
		@media screen and (max-width: 450px){
			.header {
				flex-direction: column;
				gap: 16px;
				align-items: flex-start;
			}
		}
	}

</style>