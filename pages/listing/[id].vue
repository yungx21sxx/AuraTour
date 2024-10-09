<script setup lang="ts">
	import type {IQueryBooking} from "~/types/query.types";
	import useBooking from "~/components/Booking/useBooking";
	import type {BookingInfoDTO} from "~/types/dto.types";
	import ListingBookingForm from "~/components/pages/Listing/ListingBooking/ListingBookingForm.vue";
	import useListing from "~/components/pages/Listing/useListing";
	import ListingHeader from "~/components/pages/Listing/ListingHeader.vue";
	import ListingDescription from "~/components/pages/Listing/ListingDescription.vue";
	import ListingRules from "~/components/pages/Listing/ListingRules.vue";
	import ListingYMap from "~/components/pages/Listing/ListingYMap.vue";
	import {formatDays} from "../../utils/utils";
	import ListingRooms from "~/components/pages/Listing/ListingRooms.vue";
	import useListingBooking from "~/components/pages/Listing/ListingBooking/useListingBooking";
	import ListingBookingConfirmModal from "~/components/pages/Listing/ListingBookingConfirmModal.vue";
	import ListingReviews from "~/components/pages/Listing/ListingReviews.vue";
	import ListingAdmin from "~/components/pages/Listing/ListingAdmin.vue";
	import GalleryMainSlider from "~/components/gallery/GalleryMainSlider.vue";
	import SimilarListings from "~/components/pages/Listing/SimilarListings.vue";
	


	const {isMobileOrTablet} = useDevice()
	const route = useRoute();
	const {parseBookingRouteQuery} = useBooking();
	const isAdmin = useAdmin()
	
	const {listing, fetchListing, createBookingDTO, chosenRoomId, chosenRoom, listingModalMobile} = useListing()
	const {setBookingQuery, getListingQueryLinkParameters, listingBookingConfirmModal, dateModal} = useListingBooking()
	
	const mobileBookingModal = ref(false);

	const {id} = route.params;
	
	const bookingQuery: IQueryBooking = parseBookingRouteQuery(route.query)

	const bookingDTO: BookingInfoDTO = createBookingDTO(bookingQuery);
	setBookingQuery(bookingQuery);
	
	
	await fetchListing(parseInt(<string>id), bookingDTO);
	
	watch(getListingQueryLinkParameters, async () => {
		const bookingQuery: IQueryBooking = parseBookingRouteQuery(route.query);
		const {adults, checkIn, checkOut, children, ...queryData} = bookingQuery;
		
		await fetchListing(parseInt(<string>id), {
			//@ts-ignore
			checkIn: getListingQueryLinkParameters.value.checkIn,
			//@ts-ignore
			checkOut: getListingQueryLinkParameters.value.checkOut,
			peoples: getListingQueryLinkParameters.value.adults
		});
		await navigateTo({
			path: `/listing/${id}`,
			query: {
				...getListingQueryLinkParameters.value,
				...queryData
			}
		});
	})
	
	const dates = computed(() => {
		//@ts-ignore
		const {from, to} = dateModal.value
		return {from, to}
	})
	

</script>

<template>
	<div class="bg-gray">
		<div class="listing wrapper">
			<div class="listing__content">
				
				<ListingHeader/>
				
				<GalleryMainSlider/>
				
				<GalleryFullScreen/>
				
				<ListingAdmin v-if="isAdmin"/>
				<ListingDescription/>
				<ListingRules/>
				<ListingRooms/>
				<ListingYMap id="map"/>
				
				<ListingReviews/>
			</div>
			<div class="listing__sidebar booking">
				<ListingBookingForm target="sidebar"/>
			</div>
		</div>
		<div class="wrapper">
			<SimilarListings class="pb-8"/>
		</div>
		
		<div class="order">
			<div class="order__body" v-if="dates.from && dates.to">
				<div class="order__info" v-if="listing.type !== 'guest-house'">
					<p>
						Цена за {{formatDays(listing.daysCount)}}
					</p>
					<strong> {{listing.totalPrice?.toLocaleString('ru-RU')}} ₽</strong>
				</div>
				<div class="order__info" v-else-if="chosenRoom">
					<p>
						Цена за {{formatDays(listing.daysCount)}}
					</p>
					<strong> {{chosenRoom.totalPrice?.toLocaleString('ru-RU')}} ₽</strong>
				</div>
				<div class="order__info" v-else>
					<p>
						Выберите номер
					</p>
				</div>
				<v-btn prepend-icon="mdi-lightning-bolt" color="#7059FF" class="order__btn" @click="listingModalMobile = true">Забронировать</v-btn>
			</div>
			<div class="order__body" v-else>
				<div class="order__info">
					<strong>от {{listing.dailyPrice.toLocaleString('ru-RU')}} ₽</strong>
					<p>
						в сутки
					</p>
				</div>
				<v-btn prepend-icon="mdi-lightning-bolt" color="#7059FF" class="order__btn" @click="listingModalMobile = true">Забронировать</v-btn>
			</div>
		
		</div>
		<v-dialog v-model="listingModalMobile" :fullscreen="isMobileOrTablet">
			
			<v-card>
				<v-toolbar color="#F0F3F7">
					<v-btn
						icon="mdi-close"
						@click="listingModalMobile = false"
					></v-btn>
					
					<v-toolbar-title>Заявка на бронирование</v-toolbar-title>
				</v-toolbar>
				<div class="modal pa-4">
					<ListingBookingForm target="sidebar"/>
				</div>
			</v-card>
		</v-dialog>
		
		<ListingBookingConfirmModal/>
	</div>
	

</template>

<style scoped lang="scss">
	
	.bg-gray {
		background: #F7F8F9;
		margin-top: -16px;
		padding-top: 16px;
		margin-bottom: -48px;
	}
	@media screen and (max-width: 630px) {
		.bg-gray {
			padding-top: 0;
			
		}
		
		.listing {
			margin-top: 16px !important;
			grid-template-columns: 1fr !important;
			
		}
	}
	
	.order {
		display: none;
		z-index: 100;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #FFFFFF;
		box-shadow: 5px 5px 10px #6a6d81;
		&__body {
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 16px 8px;
			
			gap: 32px;
		}
		
	}
	@media screen and (max-width: 1100px) {
		.listing {
			display: block !important;
			&__sidebar {
				display: none;
			}
		}
		.order {
			display: block;
		}
	}
	.listing {
		margin-top: 16px;
		display: grid;
		grid-template-columns: 1fr 360px;
		gap: 24px;
		
		
		
	}
	


</style>