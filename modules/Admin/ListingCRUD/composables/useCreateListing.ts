import type {ListingCreateDTO, PricePeriodCreateDTO, RoomCreateDTO} from "~/modules/Admin/ListingCRUD/types/dto.types";
import type {InitialDataResponse} from "~/modules/Admin/ListingCRUD/types/response.types";
import type {Feature} from "@yandex/ymaps3-types";
import type {ListingCreateFormData} from "~/modules/Admin/ListingCRUD/types/form-data.types";

export default () => {
	const listingFormData = useState<ListingCreateFormData>('listing-dto', () => ({
		title: null,
		description: null,
		minPrice: null,
		cityId: null,
		typeId: null,

		//принимает значения только если typeId = 1
		flatProperties: {
			elevator: false,
			floor: null,
			maxFloor: null
		},
		address: null,
		places: null,
		badCount: null,
		minDaysOrder: null,
		seaDistance: null,
		area: null,
		coords: {
			longitude: null,
			width: null,
		},
		amenities: [],
		foodOptions: [],
		photos: [],
		pricePeriods: [],
		rooms: [],
		ownerId: null,
		managerId: null
	}));
	
	const initialData = useState<InitialDataResponse>('initial-data');
	const listingToUpdateId = useState()
	
	async function fetchInitialData() {
		const [listingProperties, managers] = await Promise.all([
			$fetch('/api/listing/admin/create-initial-data'),
			$fetch('/api/users/load-managers')
		])
		initialData.value = {
			...listingProperties,
			managers
		}
	}
	
	function setAddress(address: Feature) {
		listingFormData.value.address = address.properties.name
		if (address.geometry) {
			listingFormData.value.coords.longitude = address.geometry.coordinates[0]
			listingFormData.value.coords.width = address.geometry.coordinates[1]
		}
	}

	function addListingPricePeriod(pricePeriod: PricePeriodCreateDTO) {
		listingFormData.value.pricePeriods.push(pricePeriod)
	}

	const setListingPhotos = (photos: {photoId: number, urlMin: string}[]) => listingFormData.value.photos = photos;

	async function createListing() {

		try {
			const listingResponse = await $fetch('/api/listing/admin/create', {
				method: 'POST',
				body: listingFormData.value,
			})
			await navigateTo({
				path: `/listing/${listingResponse.id}`,
			})
		} catch (e) {
			console.log(e)
		}
	}

	async function fetchListingUpdateData(listingId: number) {
		const initialData = await $fetch(`/api/listing/admin/update-data/${listingId}`)

		if (!initialData) return;
		//@ts-ignore
		const {rooms: roomsData, note, id, ...listingData} = initialData
		//@ts-ignore
		listingFormData.value = listingData;
		listingToUpdateId.value = id;
		//@ts-ignore
		listingFormData.value.photos.sort((a, b) => a.position - b.position);
		//@ts-ignore

		if (roomsData) {
			listingFormData.value.rooms = roomsData
			listingFormData.value.rooms.forEach(room => room.photos.sort((a, b) => a.position - b.position));
		}
	}
	async function updateListing() {
		const listingResponse = await $fetch('/api/listing/admin/update-listing', {
			method: 'PUT',
			body: {
				listing: listingFormData.value,
				id: listingToUpdateId.value
			}
		})
		if (!listingResponse) {
			return;
		}
		await navigateTo({
			path: `/listing/${listingResponse.id}`,
		})
	}

	return {
		listingFormData,
		initialData,
		fetchInitialData,
		setAddress,
		addListingPricePeriod,
		setListingPhotos,
		createListing,
		updateListing,
		fetchListingUpdateData
	}

}