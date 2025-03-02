<script setup lang="ts">
	import type {IQueryBooking} from "~/modules/Booking/types/query.types";
	import useBooking from "~/modules/Booking/composables/useBooking";
	import ListingHeader from "~/modules/Listing/components/ListingPage/ListingHeader.vue";
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
	import useStatistics from "~/modules/Common/useStatistics";
	import {generateSeoDescription} from "~/modules/Listing/utils/description";

	const VideoUploader = defineAsyncComponent(() => import('~/modules/Admin/Listing/components/VideoUploader.vue'));
	const ListingVideoPlayer = defineAsyncComponent(() => import('~/modules/Listing/components/ListingPage/ListingVideoPlayer.vue'));
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
	});
	
	
	
	watch(dates, async ({checkIn, checkOut}) => {
		updateListingPrices(checkIn, checkOut);
		await navigateTo({
			path: `/listing/${listing.value.id}`,
			query: {
			
			}
		})
	})
	
	const access = computed(() => {
		const fullAccess = authUser.value && ['ADMIN', 'MANAGER'].includes(authUser.value.role);
		let isListingOwner: boolean = false;
		
		if (listing.value.owner) {
			isListingOwner = authUser.value && authUser.value.id === listing.value.owner.id;
		}
		
		return {fullAccess, isListingOwner}
	})
	
	const ListingAdminPanel = defineAsyncComponent(() => import('@/modules/Admin/Listing/components/ListingAdminPanel.vue'));
	
	const shouldLoadAdminPanel = computed(() => access.value.isListingOwner || access.value.fullAccess);
	
	onMounted(() => {
		if (!access.value.isListingOwner && !access.value.fullAccess) {
			const {incrementStatistic} = useStatistics()
			incrementStatistic('views', listing.value.id)
		}
	})
	
	useSeoMeta({
		title: listing.value.title,
		description: generateSeoDescription(listing.value),
		ogTitle: listing.value.title,
		ogDescription: generateSeoDescription(listing.value),
		ogImage: 'https://aura-tour-abkhazia.ru' + listing.value.photos[0].urlFull,
	})
	
	const hasRooms = listing.value.rooms.length > 0;
	const minPrice = hasRooms
		? Math.min(...listing.value.rooms.map(r => r.minPrice))
		: listing.value.minPrice;
	
	const schemaOrg = computed(() => {
		if (listing.value.manager) {
			return {
				"@context": "https://schema.org",
				"@type": hasRooms ? "Hotel" : "LodgingBusiness",
				"name": listing.value.title,
				"description": generateSeoDescription(listing.value),
				"url": `https://aura-tour-abkhazia.ru/listing/${listing.value.id}`,
				"image": 'https://aura-tour-abkhazia.ru' + listing.value.photos[0].urlFull,
				"address": {
					"@type": "PostalAddress",
					"streetAddress": listing.value?.address,
					"addressLocality": listing.value.city?.name,
					"addressCountry": "Абхазия",
					"addressRegion": "Абхазия",
				},
				"geo": {
					"@type": "GeoCoordinates",
					"latitude": listing.value.coords.width,
					"longitude": listing.value.coords.longitude
				},
				"priceSpecification": {
					"@type": "PriceSpecification",
					"price": minPrice,
					"priceCurrency": "RUB",
					"priceValidUntil": "2025-12-31"
				},
				"makesOffer": {
					"@type": "Offer",
					"price": minPrice,
					"priceCurrency": "RUB",
					"availability": "https://schema.org/InStock",
					"validFrom": new Date().toISOString(),
					"url": `https://aura-tour-abkhazia.ru/listing/${listing.value.id}`
				},
				"offers": {
					"@type": "AggregateOffer",
					"lowPrice": listing.value.rooms.length > 0 ? Math.min(...listing.value.rooms.map(room => room.minPrice)) : listing.value.minPrice,
					"highPrice": listing.value.rooms.length > 0 ? Math.max(...listing.value.rooms.map(room => room.minPrice)) : listing.value.minPrice,
					"priceCurrency": "RUB",
					"offers": listing.value.rooms.map(room => ({
						"@type": "Offer",
						"name": room?.name,
						"price": room.minPrice,
						"priceCurrency": "RUB",
						"itemOffered": {
							"@type": "HotelRoom",
							"name": room?.name,
							"numberOfRooms": 1,
							"occupancy": {
								"@type": "QuantitativeValue",
								"minValue": 1,
								"maxValue": room.places
							},
							"amenityFeature": room.amenities.map(amenity => ({
								"@type": "LocationFeatureSpecification",
								"name": amenity,
								"value": true
							}))
						}
					}))
				},
				"contactPoint": {
					"@type": "ContactPoint",
					"name": listing.value?.manager?.name,
					"telephone": listing.value?.manager?.phone,
					"contactType": "customer service"
				},
				"telephone": listing.value.manager.phone,
				"amenityFeature": listing.value.amenities.map(amenity => ({
					"@type": "LocationFeatureSpecification",
					"name": amenity,
					"value": true
				})),
				"breadcrumb": {
					"@type": "BreadcrumbList",
					"itemListElement": [
						{
							"@type": "ListItem",
							"position": 1,
							"name": "Главная",
							"item": "https://aura-tour-abkhazia.ru"
						},
						{
							"@type": "ListItem",
							"position": 2,
							"name": listing.value.city?.name,
							"item": `https://aura-tour-abkhazia.ru/${listing.value.city.slug}`
						},
						{
							"@type": "ListItem",
							"position": 3,
							"name": listing.value.id,
							"item": `https://aura-tour-abkhazia.ru/${listing.value.id}`
						}
					]
				},
				"openingHours": "Mo-Su 00:00-24:00",
			}
		}
		return {}
	});
	
	useHead({
		script: [
			{
				type: 'application/ld+json',
				children: JSON.stringify(schemaOrg.value)
			}
		]
	})
	
</script>

<template>
	<AncorsMenuFixed/>
	<div class="bg-gray" id="scroll-container">
		<div class="menu-main">
			<MenuMain/>
		</div>
		<div class="wrapper">
			<client-only>
				<ListingAdminPanel v-if="shouldLoadAdminPanel"/>
			</client-only>
			<ListingHeader/>
			<GalleryDesktopPreviews v-if="!isMobileOrTablet && listing.photos.length > 3"/>
		</div>
		
		<main class="listing wrapper">
			<div class="listing__content">
				<GalleryMainSlider id="gallery" v-if="isMobileOrTablet || listing.photos.length < 3"/>
				<div v-if="isMobileOrTablet" style="text-align: center; margin-bottom: 24px;">
					<BtnPrimary  width="300px" :prepend-icon="mdiImage" @click="galleyThumbsModalIsOpen = true">Показать все фото</BtnPrimary>
				</div>
				<client-only>
					<VideoUploader v-if="access.fullAccess || access.isListingOwner"/>
					<ListingVideoPlayer v-else-if="listing.videos.length > 0"/>
				</client-only>
				<ListingBookingForm target="sidebar" v-if="isMobileOrTablet"/>
				<ListingRooms id="rooms" />
				<ListingDescription id="about"/>
				<ListingRules id="rules"/>
				<ListingYMap id="map"/>
			
				<ListingReviews id="reviews"/>
			</div>
			<div class="listing__sidebar booking" v-if="!isMobileOrTablet">
				<ListingBookingForm target="sidebar"/>
			</div>
		</main>
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