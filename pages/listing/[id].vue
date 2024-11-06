<script setup lang="ts">
	import type {IQueryBooking} from "~/modules/Booking/types/query.types";
	import useBooking from "~/modules/Booking/composables/useBooking";
	import ListingHeader from "~/modules/Listing/components/ListingPage/ListingHeader.vue";
	import ListingAdmin from "~/modules/Listing/components/ListingPage/ListingAdmin.vue";
	import GalleryMainSlider from "~/modules/Listing/components/Gallery/GalleryMainSlider.vue"
	import GalleryFullScreenModal from "~/modules/Listing/components/Gallery/GalleryFullScreenModal.vue";
	import ListingDescription from "~/modules/Listing/components/ListingPage/ListingDescription.vue";
	import ListingRules from "~/modules/Listing/components/ListingPage/ListingRules.vue";
	import ListingRooms from "~/modules/Listing/components/ListingPage/ListingRooms.vue";
	import ListingYMap from "~/modules/Listing/components/ListingPage/ListingYMap.vue";
	import ListingBookingForm from "~/modules/Listing/components/ListingBooking/ListingBookingForm.vue";
	import SimilarListings from "~/modules/Listing/components/ListingPage/SimilarListings.vue";
	import useListing from "~/modules/Listing/composables/useListing";
	import useListingBooking from "~/modules/Listing/composables/useListingBooking";
	import ListingBookingConfirmModal from "~/modules/Listing/components/ListingBooking/ListingBookingConfirmModal.vue";
	import MenuMain from "~/modules/Menu/components/MenuMain.vue";
	import AncorsMenuFixed from "~/modules/Listing/components/ListingPage/Menu/AncorsMenuFixed.vue";
	import GalleryDesktopPreviews from "~/modules/Listing/components/Gallery/GalleryDesktopPreviews.vue";
	import GalleryThumbsModal from "~/modules/Listing/components/Gallery/GalleryThumbsModal.vue";
	import ListingReviews from "~/modules/Listing/components/ListingPage/ListingReviews.vue";
	import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";
	import {mdiImage} from "@mdi/js";
	import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
	import useGallery from "~/modules/Listing/composables/useGallery";
	const {isMobileOrTablet} = useDevice();
	
	const authUser = useAuthUser();
	
	const {galleyThumbsModalIsOpen} = useGallery()
	
	const {parseBookingRouteQuery} = useBooking();
	const {setListingBookingInfo, dateModal} = useListingBooking();
	const {initListingData, updateListingPrices, queryForGoBack, listing} = useListing();
	
	const route = useRoute();
	const {id} = route.params;
	const query = { ...route.query };
	
	queryForGoBack.value = query;
	
	const bookingQuery: IQueryBooking = parseBookingRouteQuery(query)
	
	await initListingData(parseInt(id as string), bookingQuery);
	setListingBookingInfo(bookingQuery);
	
	const dates = computed(() => {
		const {checkIn, checkOut} = dateModal.value;
		return {checkIn, checkOut};
	})
	
	watch(dates, async ({checkIn, checkOut}) => {
		updateListingPrices(checkIn, checkOut);
	})
	
	const isAdmin = computed(() => authUser.value && ['ADMIN', 'MANAGER', 'LANDLORD'].includes(authUser.value.role))
	
	const ListingAdminPanel = computed(() => {
		if (isAdmin) {
			return defineAsyncComponent(() => import('@/modules/Admin/Listing/components/ListingAdminPanel.vue'))
		}
		return null;
	})
	

</script>

<template>
	<AncorsMenuFixed/>
	<div class="bg-gray" id="scroll-container">
		<div class="menu-main">
			<MenuMain/>
		</div>
		<div class="wrapper">
			<ListingAdminPanel v-if="isAdmin"/>
			<ListingHeader/>
			<GalleryDesktopPreviews v-if="!isMobileOrTablet && listing.photos.length > 3"/>
		</div>
		
		<div class="listing wrapper">
			<div class="listing__content">
				<GalleryMainSlider id="gallery" v-if="isMobileOrTablet || listing.photos.length < 3"/>
				<div v-if="isMobileOrTablet" style="text-align: center; margin-bottom: 24px;">
					<BtnPrimary  width="300px" :prepend-icon="mdiImage" @click="galleyThumbsModalIsOpen = true">Показать все фото</BtnPrimary>
				</div>
				<ListingBookingForm target="sidebar" v-if="isMobileOrTablet "/>
				<ListingRooms id="rooms" />
				<ListingDescription id="about"/>
				<ListingRules id="rules"/>
				<ListingYMap id="map"/>
				<ListingReviews/>
			</div>
			<div class="listing__sidebar booking" v-if="!isMobileOrTablet">
				<ListingBookingForm target="sidebar"/>
			</div>
		</div>
		<div class="wrapper">
			<SimilarListings class="pb-8"/>
		</div>
		<GalleryFullScreenModal/>
		<GalleryThumbsModal/>
		<ListingBookingConfirmModal/>
	</div>
	

</template>

<style scoped lang="scss">
	.menu-main {
		background: #fff; padding: 4px 0; margin-bottom: 32px;
		
		@media screen and (max-width: 630px) {
			margin-bottom: 20px;
		}
	}
	.bg-gray {
		background: #F7F8F9;
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
		grid-template-columns: 1fr 340px;
		gap: 24px;
		
		
		
	}
	


</style>