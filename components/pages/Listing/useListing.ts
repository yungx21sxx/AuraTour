import type {BookingInfoDTO} from "~/types/dto.types";
import type {IGuestHouseRoom, IListingResponse, IPhoto} from "~/types/response.types";
import type {IQueryBooking} from "~/types/query.types";

interface RoomPhotos {
	roomId: number,
	photos: IPhoto[]
}
export default () => {
	const listing = useState<IListingResponse>('listing-data');
	const listingPhotos = useState<IPhoto[]>('listing-photos');
	const chosenRoomId = useState<number>('chosen-room');
	const listingModalMobile = useState(() => false);
	const bookingDTOState = useState<BookingInfoDTO>();
	const roomsPhotos = useState<RoomPhotos[]>(() => []);

	async function fetchListing (listingId: number, bookingDTO: BookingInfoDTO) {
		bookingDTOState.value = bookingDTO;
		//@ts-ignore
		listing.value = await $fetch(`/api/listings/${listingId}`, {
			method: 'POST',
			body: bookingDTOState.value
		})
		listingPhotos.value = listing.value.photos
			.sort((a, b) => (a.position - b.position))
			.map((photo, index) => ({
				id: index,
				urlMin: photo.urlMin,
				urlFull: photo.urlFull,
				position: photo.position
			}))
		for (const room of listing.value.rooms) {
			const currentRoomPhotos = room.photos
				.toSorted((a, b) => (a.position - b.position))
				.map((photo, index) => ({
					id: index,
					urlMin: photo.urlMin,
					urlFull: photo.urlFull,
					position: photo.position
				}))
			roomsPhotos.value.push({
				roomId: room.id,
				photos: currentRoomPhotos
			})

		}
	}

	function getRoomPhoto(roomId: number) {
		return roomsPhotos.value.find(roomPhotos => roomPhotos.roomId === roomId)?.photos ?? []
	}

	async function refreshListing(listingId: number) {
		listing.value = await $fetch(`/api/listings/${listingId}`, {
			method: 'POST',
			body: bookingDTOState.value
		})
	}

	const chosenRoom = computed<IGuestHouseRoom | null>(() => listing.value.rooms.find(room => room.id === chosenRoomId.value) || null)

	function createBookingDTO(query: IQueryBooking): BookingInfoDTO {
		return {
			regionId: query.regionId ?? null,
			cityId: query.cityId ?? null,
			checkIn: query.checkIn ?? null,
			checkOut: query.checkOut ?? null,
			peoples: query.adults
		}
	}

	return {
		listing,
		listingPhotos,
		chosenRoomId,
		fetchListing,
		createBookingDTO,
		chosenRoom,
		listingModalMobile,
		refreshListing,
		roomsPhotos,
		getRoomPhoto
	}
}