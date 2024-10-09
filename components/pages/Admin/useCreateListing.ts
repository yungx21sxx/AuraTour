import type {ListingCreateCompleteDTO, ListingCreateDTO, PricePeriodCreateDTO, RoomCreateDTO} from "~/types/dto.types";
import type {InitialDataResponse} from "~/types/response.types";
import type {Feature} from "@yandex/ymaps3-types";

export default () => {
	const listingDTO = useState<ListingCreateDTO>('listing-dto', () => ({
		title: '',
		description: '',
		minPrice: 0,
		cityId: null,
		typeId: null,
		address: '',
		places: 2,
		badCount: 1,
		minDaysOrder: 3,
		seaDistance: 0,
		area: null,
		coords: {
			longitude: null,
			width: null,
		},
		phoneRaw: '',
		phone: '',
		renterName: '',
		amenities: [],
		foodOptions: [],
		photos: [],
		pricePeriods: [],
		elevator: false,
		floor: 0,
		maxFloor: 0,
	}));

	const useRooms = () => useState<RoomCreateDTO[]>('rooms-create-dto', () => []);
	const rooms = useRooms();
	const initialData = useState<InitialDataResponse>('initial-data');
	const validationFail = useState(() => false);

	const createOrUpdateError = useState(() => false);
	const roomsDontAdded = useState(() => false);
	async function fetchListingUpdateData(listingId: number) {
		const initialData = await $fetch(`/api/listing/${listingId}`)

		if (!initialData) return;

		//@ts-ignore
		const {rooms: roomsData, note, ...listingData} = initialData
		//@ts-ignore
		listingDTO.value = listingData;
		//@ts-ignore
		listingDTO.value.photos.sort((a, b) => a.position - b.position);
		//@ts-ignore
		roomsData.forEach(room => room.photos.sort((a, b) => a.position - b.position))
		rooms.value = roomsData

	}

	async function fetchInitialData() {
		initialData.value = await $fetch<InitialDataResponse>('/api/listing/initial-data')
	}

	function isEmptyValue(value: any): boolean {
		return (value === '' ||
			value === null ||
			value === undefined ||
			(Array.isArray(value) && value.length === 0) || (typeof value === 'object' && true && Object.keys(value).length === 0 && value.constructor === Object));
	}

	function checkForEmptyFields(obj: ListingCreateDTO): boolean {
		const isHotel = listingDTO.value?.typeId === 2 || listingDTO.value?.typeId === 6 || listingDTO.value?.typeId === 8;
		const ignoreFields = isHotel ? ['pricePeriods', 'area', 'badCount', 'places', 'floor', 'maxFloor', 'elevator', 'pricePeriods'] : ['pricePeriods', 'floor', 'maxFloor', 'elevator'];

		for (const key in obj) {
			if (ignoreFields.includes(key)) {
				continue; // Пропускаем проверку поля, если оно в списке игнорируемых
			}

			const value = (obj as any)[key];

			if (isEmptyValue(value)) {
				return true; // Найдено пустое значение
			}

			// Рекурсивная проверка для вложенных объектов, игнорируемых полей нет
			if (typeof value === 'object' && value !== null && checkForEmptyFields(value)) {
				return true; // Найдено пустое значение во вложенном объекте
			}
		}
		return false; // Пустые значения не найдены
	}
	function setAddress(address: Feature) {
		listingDTO.value.address = address.properties.name
		if (address.geometry) {
			listingDTO.value.coords.longitude = address.geometry.coordinates[0]
			listingDTO.value.coords.width = address.geometry.coordinates[1]
		}
	}

	function addListingPricePeriod(pricePeriod: PricePeriodCreateDTO) {
		listingDTO.value.pricePeriods.push(pricePeriod)
	}

	const setPhoneRaw = (phone: string) => listingDTO.value.phoneRaw = phone;
	const setListingPhotos = (photos: {photoId: number, urlMin: string}[]) => listingDTO.value.photos = photos;



	async function updateListing() {
		const isSomeEmpty = checkForEmptyFields(listingDTO.value);
		if (isSomeEmpty) {
			validationFail.value = true
			return;
		}
		const isHotel = listingDTO.value?.typeId === 2 || listingDTO.value?.typeId === 6 || listingDTO.value?.typeId === 8;
		if (isHotel && rooms.value.length > 0) {
			const minRoomPrice = Math.min.apply(null, rooms.value.map(i => i.minPrice));
			listingDTO.value.minPrice = minRoomPrice;
		}
		const listingResponse = await $fetch('/api/listing/update', {
			method: 'PUT',
			body: {
				listing: listingDTO.value,
				rooms: rooms.value,
			}
		})
		if (!listingResponse) {
			createOrUpdateError.value = true;
			return;
		}
		await navigateTo({
			path: `/listing/${listingResponse.id}`,
		})
	}

	async function createListing() {

		const isSomeEmpty = checkForEmptyFields(listingDTO.value);
		const isHotel = listingDTO.value?.typeId === 2 || listingDTO.value?.typeId === 6 || listingDTO.value?.typeId === 8;
		if (isHotel && rooms.value.length === 0) {
			roomsDontAdded.value = true;
		}
		if (isSomeEmpty) {
			validationFail.value = true
			return;
		}
		try {
			const listingResponse = await $fetch('/api/listing/create', {
				method: 'POST',
				body: {
					listing: listingDTO.value,
					rooms: rooms.value,
				}
			})
			if (!listingResponse) {
				createOrUpdateError.value = true;
				return;
			}
			await navigateTo({
				path: `/listing/${listingResponse.id}`,
			})
		} catch (e) {
			console.log(e)
		}

	}

	return {
		listingDTO,
		rooms,
		useRooms,
		roomsDontAdded,
		initialData,
		fetchInitialData,
		setAddress,
		addListingPricePeriod,
		validationFail,
		setPhoneRaw,
		setListingPhotos,
		createListing,
		fetchListingUpdateData,
		updateListing,
		createOrUpdateError
	}

}