<script setup lang="ts">
	import HeaderDesktop from "~/components/pages/Search/HeaderDesktop.vue";
	import useBooking from "~/components/Booking/useBooking";
	import useCatalog from "~/components/pages/Search/useCatalog";
	import FilterForm from "~/components/pages/Search/FilterForm.vue";
	import type {BookingInfoDTO, FiltersDTO} from "~/types/dto.types";
	import useFilters from "~/components/pages/Search/useFilters";
	import type {IQueryBooking} from "~/types/query.types";
	import FilterFormModal from "~/components/pages/Search/FilterFormModal.vue";
	import useSearch from "~/components/Booking/useSearch";
	
	const route = useRoute();

	const {setBookingQuery, parseBookingRouteQuery, openSetDateModal, bookingModals} = useBooking();
	const {createBookingDTO, loadListings, listingsList, sortBy, initListings, setFiltersDTO} = useCatalog();
	const {fetchBookingFilters, parseQueryParams} = useFilters()
	
	const bookingQuery: IQueryBooking = parseBookingRouteQuery(route.query);

	const {loadSearchData} = useSearch();
	
	const dates = computed(() => {
		const {from, to} = bookingModals.value.date
		return {from, to}
	})
	
	await loadSearchData();
	
	setBookingQuery(route.query);
	createBookingDTO(bookingQuery);
	const filtersQueryParameters: FiltersDTO = parseQueryParams(route.query);
	setFiltersDTO(filtersQueryParameters);
	
	await Promise.all([
		fetchBookingFilters(bookingQuery),
		initListings()
	])
	
	const sortSelect = [
		{
			text: 'По популярности',
			value: 'popularity'
		},
		{
			text: 'Близость к морю',
			value: 'sea-distance'
		},
		{
			text: 'По возрастанию цены',
			value: 'increase'
		},
		{
			text: 'По убыванию цены',
			value: 'decrease'
		}
	];
	
	watch(sortBy, () => {
		initListings()
	})
	
</script>

<template>
	<HeaderDesktop/>
	<div
		class="catalog wrapper"
	>
		<div class="catalog__sidebar">
			<FilterForm/>
		</div>
		<div class="catalog__content">
			<div class="catalog__filters">
				<h3 id="listings">Найдено {{listingsList.count}} варинтов жилья</h3>
				<VSelect
					hide-details
					class="catalog__select"
					:items="sortSelect"
					item-title="text"
					v-model="sortBy"
					
					density="compact"
				></VSelect>
			</div>
<!--			<v-alert-->
<!--				icon="mdi-calendar-month-outline"-->
<!--				class="mt-4"-->
<!--				color="#FFFFFF"-->
<!--				v-if="!dates.from && !dates.to"-->
<!--			>-->
<!--				<template #text>-->
<!--					<div class="alert">-->
<!--						<h4 class="alert__title mb-2">Выберите даты заезда и отъезда</h4>-->
<!--						<p class="mb-4">Доступность жилья и стоимость зависят от даты проживания</p>-->
<!--						<v-btn color="#7059FF" @click="openSetDateModal">Выбрать даты</v-btn>-->
<!--					</div>-->
<!--				</template>-->
<!--			</v-alert>-->
			<v-infinite-scroll :onLoad="loadListings">
				<template v-for="listing of listingsList.listings" :key="listing.id">
					<ListingItem :listing="listing"/>
				</template>
				<template v-slot:empty>
					<v-alert type="success">Объекты закончились:(</v-alert>
				</template>
			</v-infinite-scroll>
		</div>
	</div>
	
	<FilterFormModal/>
	

</template>

<style scoped lang="scss">

	

	.catalog {
		display: grid;
		grid-template-columns: 1fr 3fr;
		gap: 16px;
		margin-top: 16px;
		
		@media screen and (max-width: 950px) {
			margin-top: 16px !important;
			display: block;
			&__sidebar {
				display: none;
			}
		}
		
		@media screen and (max-width: 600px) {
			&__filters {
				display: block !important;
				margin-bottom: 0 !important;
			}
			&__select {
				max-width: 500px !important;
				width: 100%;
				margin-top: 16px;
			}
			h3 {
				font-weight: 600;
				font-size: 16px;
			}
		}
		
		&__sidebar {
			background: $bg-card;
			padding: 16px;
			border-radius: 7px;
			height: fit-content;
		}
		&__filters {
			display: flex;
			justify-content: space-between;
		
			width: 100%;
			align-items: center;
		}
		
		&__select {
			display: inline-block;
			max-width: 250px ;
		}
	}
	


</style>