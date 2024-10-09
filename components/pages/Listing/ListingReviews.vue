<script setup lang="ts">
	import useListing from "~/components/pages/Listing/useListing";
	import useBooking from "~/components/Booking/useBooking";
	import type {BookingInfoDTO, ReviewCreateDTO} from "~/types/dto.types";
	import type {IQueryBooking} from "~/types/query.types";
	import useListingBooking from "~/components/pages/Listing/ListingBooking/useListingBooking";
	import type {IReview} from "~/types/response.types";
	import {getWordWithProperEnding} from "~/utils/utils";

	
	const authUser = useAuthUser()
	const {listing, fetchListing, createBookingDTO, refreshListing} = useListing()
	const {beautifyDate, parseBookingRouteQuery} = useBooking()
	const {getListingQueryLinkParameters} = useListingBooking()
	const {isMobile} = useDevice()
	const route = useRoute();
	
	const reviewCreatePending = ref(false);
	const reviewCreateModal = ref(false);
	
	const reviewDTODefault = {
		listingId: listing.value.id,
		comment: '',
		rating: 5,
		userId: authUser.value?.id || null,
		userName: authUser.value?.name || '',
	}
	
	const {data: reviews, error, pending, refresh} = useLazyAsyncData<IReview[]>('reviews', () => $fetch(`/api/review/${listing.value.id}`))
	
	const createReviewDTO = reactive<ReviewCreateDTO>({...reviewDTODefault})
	const {id} = route.params;
	
	const bookingQuery: IQueryBooking = parseBookingRouteQuery(route.query);
	const {adults, checkIn, checkOut, children, ...queryData} = bookingQuery;
	
	async function createReview() {
		reviewCreatePending.value = true;
		const {data, error} = await useFetch('/api/review/create', {
			method: 'POST',
			body: createReviewDTO
		})
		if (!data.value) {
			return;
		}
		await refresh();
		await refreshListing(parseInt(<string>id))
		reviewCreatePending.value = false;
		reviewCreateModal.value = false;
	}
</script>

<template>
	<div class="reviews listing-block">
		<div class="reviews__rating d-flex align-center" style="justify-content: space-between">
			<h2>Отзывы</h2>
			<p class="info__reviews" v-if="listing.reviewCount === 0">Нет отзывов</p>
			<div class="review__count" v-else >
				<v-chip prepend-icon="mdi-star" color="#7059FF" label >{{listing.averageRating.toFixed(1)}}</v-chip>
				<span>{{getWordWithProperEnding(listing.reviewCount, 'отзыв') }}</span>
			</div>
		</div>
		<v-divider class="mt-4"/>
		<div class="reviews__header mt-4 mb-4" style="justify-content: space-between">
			<p>Отдыхали здесь? Поделитесь впечатлениями!</p>
			<v-btn color="#7059FF" variant="tonal" @click="reviewCreateModal = true">
				Оставить отзыв
			</v-btn>
		</div>
		<v-divider class="mb-4"/>
		<div v-if="!pending">
			<v-card class="review mb-4" v-for="review of reviews" elevation="0">
				<v-card-item>
					<div class="d-flex align-center" style="gap: 16px; width: 100%">
						<v-avatar color="#7059FF">{{review.userName[0]}}</v-avatar>
						<div>
							<h4>{{review.userName}}</h4>
							<p>{{beautifyDate(new Date(review.createdAt))}}</p>
						</div>
						<v-rating
							style="margin-left: auto"
							color="yellow-darken-3"
							v-model="review.rating"
							density="compact"
						></v-rating>
					</div>
				</v-card-item>
				<v-card-item>
					{{review.comment}}
				</v-card-item>
			</v-card>
		</div>
		
		
		<v-dialog v-model="reviewCreateModal" :fullscreen="isMobile" max-width="600px">
			<v-card>
				<v-toolbar>
					<v-btn
						icon="mdi-close"
						@click="reviewCreateModal = false"
					></v-btn>
					
					<v-toolbar-title>Новый отзыв</v-toolbar-title>
				</v-toolbar>
				<v-card-item>
					<v-form class="mt-4 mb-4" @submit.prevent="createReview">
						<v-text-field
							label="Ваше имя"
							v-model="createReviewDTO.userName"
							:rules="[v => !!v || 'Введите имя']"
							required
						/>
						<v-textarea variant="outlined"
						            style="height: 170px !important;"
						            label="Напишите отзыв"
						            v-model="createReviewDTO.comment"
						            :rules="[v => !!v || 'Поле обезательно для заполнения']"
						            required
						/>
						<p class="mt-4 mb-2">Ваша оценка</p>
						<v-rating
							style="margin-left: auto"
							color="yellow-darken-3"
							v-model="createReviewDTO.rating"
							density="compact"
							hover
							class="mb-4"
						></v-rating>
						<v-btn width="100%" color="#7059FF" type="submit" :loading="reviewCreatePending">Оставить отзыв</v-btn>
					</v-form>
					
				</v-card-item>
			</v-card>
			
		</v-dialog>
	</div>

</template>

<style scoped lang="scss">

.review__count {
	display: flex;
	gap: 8px;
	align-items: center;
}

.reviews__header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	
	@media screen and (max-width: 500px){
		display: block !important;
		button {
			margin-top: 16px;
		}
	}
}



</style>