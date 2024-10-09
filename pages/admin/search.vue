<script setup lang="ts">
import Fuse, {type FuseResult} from 'fuse.js';
	
	
	interface ISearchRes {
		id: number,
		title: string,
		photo: string,
		type: string,
		city: string,
		address: string,
		phone: string,
		renterName: string
	}
	
	definePageMeta({
		layout: 'admin',
		middleware: ['admin-only'],
	})
	
	const {data: listings} = await useFetch<ISearchRes[]>('/api/search/listings');
	const searchQuery = ref("");
	let fuse: Fuse<ISearchRes>;
	const searchResultsRaw = ref<FuseResult<ISearchRes>[]>();
	
	const searchedListings = ref<ISearchRes[]>();
	const initializeFuse = () => {
		if (!listings.value) return;
		fuse = new Fuse(listings.value, {
			keys: ["title", "type", "city", "address"],
			threshold: 0.4,
			ignoreLocation: true,
			includeScore: true,
		});
	};
	
	const performSearch = () => {
		if (searchQuery.value.trim() === '') {
			searchResultsRaw.value = [];
			return;
		}
		searchResultsRaw.value = fuse.search(searchQuery.value);
	};
	
	onMounted(() => {
		initializeFuse();
	})
	
	watch(searchQuery, () => {
		performSearch();
		if (searchResultsRaw.value) {
			searchedListings.value = searchResultsRaw.value.map(result => result.item)
		}
	})

</script>

<template>
	<div class="wrapper">
		<v-text-field prepend-icon="mdi-magnify" v-model="searchQuery" class="mt-8" clearable/>
		<div class="search">
			<NuxtLink class="listing"
			     v-for="listing of searchedListings"
			     :key="listing.id"
			     :to="`/listing/${listing.id}`"
			>
				<img :src="listing.photo"/>
				<div class="listing__body">
					<h4>{{listing.title}}</h4>
					<v-chip class="listing__chip" prepend-icon="mdi-map-marker" variant="text">{{listing.city}}, {{listing.address}}</v-chip> <br>
					<v-chip class="listing__chip">{{listing.type}}</v-chip> <br>
					<v-chip variant="text" class="listing__chip" prepend-icon="mdi-phone">{{listing.renterName}}: +7 {{listing.phone}}</v-chip>
				</div>
			</NuxtLink>
		</div>
	
	</div>

</template>

<style scoped lang="scss">
	.search {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 32px;
	}
	.listing {
		color: $text-main;
		display: flex;
		gap: 8px;
		padding: 8px;
		border-radius: 7px;
		background: #FFF;
		
		img {
			height: 150px;
			width: 150px;
			object-fit: cover;
		}
		h4, &__chip {
			margin-bottom: 8px;
		}
		
	}
	
	@media screen  and (max-width: 800px){
		.search {
			display: block;
			> * {
				margin-bottom: 16px;
			}
		}
		.listing {
			display: block;
		}
		.listing img {
			height: 70px;
			width: 70px;
			margin-bottom: 8px;
		}
	}

</style>