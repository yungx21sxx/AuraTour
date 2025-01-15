import type {ListingCreateDTO, PricePeriodCreateDTO, RoomCreateDTO} from "~/modules/Admin/ListingCRUD/types/dto.types";
import type {InitialDataResponse} from "~/modules/Admin/ListingCRUD/types/response.types";
import type {Feature} from "@yandex/ymaps3-types";
import type {ListingCreateFormData} from "~/modules/Admin/ListingCRUD/types/form-data.types";
import useTelegram from "~/composables/UseTelegram";

export default () => {
	const listingFormData = useState<ListingCreateFormData>('listing-dto', () => ({
		title: null,
		description: null,

		cityId: null,
		typeId: null,

		//принимает значения только если typeId = 1
		flatProperties: {
			elevator: false,
			floor: null,
			maxFloor: null
		},

		address: null,

		//проверяем, если isHotelType = false
		minPrice: null,
		places: null,
		//это на самом деле количесвто комнат
		badCount: null,
		area: null,
		//;;;;

		minDaysOrder: null,
		seaDistance: null,

		coords: {
			longitude: null,
			width: null,
		},
		amenities: [],
		foodOptions: [],
		photos: [],
		videos: [],
		//Не проверяем
		pricePeriods: [],

		//Проверяем если если isHotelType = true
		rooms: [],
		//не проверяем
		ownerId: null,

		//Проверяем
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

	function validateListingFormData(data: ListingCreateFormData, isHotelType: boolean, isAdmin: boolean) {
		const errors = [];

		// Всегда обязательные поля
		if (!data.title) errors.push("Поле 'Заголовок' не заполнено");
		if (!data.description) errors.push("Поле 'Описание' не заполнено");
		if (!data.cityId) errors.push("Поле 'Город' не заполнено");
		if (!data.typeId) errors.push("Поле 'Тип объекта' не заполнено");
		if (!data.address) errors.push("Поле 'Адрес' не заполнено");
		if (!data.minDaysOrder) errors.push("Поле 'Минимальное количество дней для бронирования' не заполнено");
		if (!data.seaDistance) errors.push("Поле 'Расстояние до моря' не заполнено");
		if (!data.coords || data.coords.longitude === null || data.coords.longitude === undefined) errors.push("Поле 'Долгота' не заполнено");
		if (!data.coords || data.coords.width === null || data.coords.width === undefined) errors.push("Поле 'Широта' не заполнено");
		if (!data.managerId && isAdmin) errors.push("Менеджер не указан");
		if (!data.photos || data.photos.length === 0) errors.push("Фотографии не загружены");

		// Обязательные поля, если typeId == 1
		if (data.typeId === 1) {
			if (!data.flatProperties) {
				errors.push("Свойства квартиры не указаны");
			} else {
				if (data.flatProperties.floor === null || data.flatProperties.floor === undefined) errors.push("Поле 'Этаж' не заполнено");
				if (data.flatProperties.maxFloor === null || data.flatProperties.maxFloor === undefined) errors.push("Поле 'Количество этажей в здании' не заполнено");
				// Поле elevator (лифт) имеет значение по умолчанию false, поэтому его можно не проверять
			}
		}

		// Обязательные поля, если isHotelType == false
		if (!isHotelType) {
			if (!data.minPrice) errors.push("Поле 'Минимальная цена' не заполнено");
			if (!data.places) errors.push("Поле 'Количество мест' не заполнено");
			if (!data.badCount) errors.push("Поле 'Количество комнат' не заполнено");
			if (!data.area) errors.push("Поле 'Площадь' не заполнено");
		}

		// Обязательные поля, если isHotelType == true
		if (isHotelType) {
			if (!data.rooms || data.rooms.length === 0) {
				errors.push("Номера не добавленны");
			}
		}

		return errors;
	}
	const errorMassages = useState<string[]>(() => [])

	async function createListing(userRole: 'TOURIST' | 'LANDLORD' | 'MANAGER' | 'ADMIN') {
		if (!listingFormData.value.typeId) {
			errorMassages.value = ['Не указан тип жилья.']
			return;
		}
		const errors = validateListingFormData(listingFormData.value, [2, 6, 8].includes(listingFormData.value.typeId), ['ADMIN' , 'MANAGER'].includes(userRole) );

		if (errors.length > 0) {
			errorMassages.value = errors;
			return;
		}
		try {
			const listingResponse = await $fetch('/api/listing/admin/create', {
				method: 'POST',
				body: listingFormData.value,
			})

			if (['TOURIST' , 'LANDLORD'].includes(userRole)) {
				const {sendListingValidationMassage} = useTelegram();
				await sendListingValidationMassage('create', listingResponse.id);
			}
			localStorage.removeItem('listingFormData');
			await navigateTo({
				path: `/listing/${listingResponse.id}`,
			})
		} catch (e) {
			console.log(e)
		}
	}

	const ownerData = useState(() => null)

	async function fetchListingUpdateData(listingId: number) {
		const initialData = await $fetch(`/api/listing/admin/update-data/${listingId}`);

		if (!initialData) return;
		//@ts-ignore
		const {rooms: roomsData, note, id, owner, ...listingData} = initialData
		//@ts-ignore
		listingFormData.value = listingData;
		listingToUpdateId.value = id;
		ownerData.value = owner;
		//@ts-ignore
		listingFormData.value.photos.sort((a, b) => a.position - b.position);
		//@ts-ignore

		if (roomsData) {
			listingFormData.value.rooms = roomsData
			listingFormData.value.rooms.forEach(room => room.photos.sort((a, b) => a.position - b.position));
		}
	}


	async function updateListing(userRole: 'TOURIST' | 'LANDLORD' | 'MANAGER' | 'ADMIN') {
		if (!listingFormData.value.typeId) {
			errorMassages.value = ['Не указан тип жилья.']
			return;
		}
		const errors = validateListingFormData(listingFormData.value, [2, 6, 8].includes(listingFormData.value.typeId), ['ADMIN' , 'MANAGER'].includes(userRole) );
		if (errors.length > 0) {
			errorMassages.value = errors;
			return;
		}

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
		if (['TOURIST' , 'LANDLORD'].includes(userRole)) {
			const {sendListingValidationMassage} = useTelegram();
			await sendListingValidationMassage('update', listingResponse.id);
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
		ownerData,
		errorMassages,
		setListingPhotos,
		createListing,
		updateListing,
		fetchListingUpdateData
	}

}