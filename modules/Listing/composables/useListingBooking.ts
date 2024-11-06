import type {IQueryBooking} from "~/modules/Booking/types/query.types";

interface IPeopleCount {
	adults: number,
	children: number
}

interface IDateModal {
	isOpen: boolean
	checkIn: Date | null,
	checkOut: Date | null,
}

export default () => {
	const peopleCountDefault = {
		adults: 2,
		children: 0
	}

	const chosenRoomId = useState<number | null>(() => null);

	const describeGroup = (adults: number, childrens: number) => {
		function pluralize(n: number, forms: [string, string, string]): string {
			if (n % 10 === 1 && n % 100 !== 11) {
				return forms[0];
			} else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
				return forms[1];
			} else {
				return forms[2];
			}
		}

		const adultsStr = `${adults} ${pluralize(adults, ['взрослый', 'взрослых', 'взрослых'])}`;
		const childrenStr = childrens > 0 ? `, ${childrens} ${pluralize(childrens, ['ребенок', 'ребенка', 'детей'])}` : '';

		return `${adultsStr}${childrenStr}`;
	}

	const peopleCount = useState<IPeopleCount>(() => ({
		...peopleCountDefault
	}));

	const listingBookingConfirmModal = useState<boolean>(() => false)

	const dateModal = useState<IDateModal>(() => ({
		isOpen: false,
		checkIn: null,
		checkOut: null,
	}));

	const getListingQueryLinkParameters = computed(() => {
		const { checkIn, checkOut } = dateModal.value
		return {
			checkIn: checkIn?.toDateString(),
			checkOut: checkOut?.toDateString(),
			adults: peopleCount.value.adults,
			children: peopleCount.value.children
		}
	})

	function setListingBookingInfo(parsedQuery: IQueryBooking) {
		dateModal.value.checkIn = parsedQuery.checkIn ?? null
		dateModal.value.checkOut = parsedQuery.checkOut ?? null
		peopleCount.value = {
			adults: parsedQuery.adults === 0 ? 2 : parsedQuery.adults,
			children: parsedQuery.children
		}
	}

	const listingBookingInfo = computed<{
		checkIn: Date | null,
		checkOut: Date | null,
		adults: number,
		children: number
	}>(() => ({
		checkIn: dateModal.value.checkIn,
		checkOut: dateModal.value.checkOut,
		adults: peopleCount.value.adults,
		childrens: peopleCount.value.children
	}))


	const openSetDateModal = () => {
		dateModal.value.isOpen = true
	}

	const openBookingModal = (roomId?: number) => {
		if (roomId) chosenRoomId.value = roomId
		listingBookingConfirmModal.value = true
	}

	const closeSetDateModal = (checkIn?: Date, checkOut?: Date) => {
		if (!checkIn || !checkOut) {
			dateModal.value.isOpen = false;
			return;
		}

		dateModal.value.checkIn = checkIn;
		dateModal.value.checkOut = checkOut;
		dateModal.value.isOpen = false;

	}
	return {
		peopleCount,
		dateModal,
		setListingBookingInfo,
		openSetDateModal,
		closeSetDateModal,
		getListingQueryLinkParameters,
		listingBookingConfirmModal,
		describeGroup,
		openBookingModal,
		listingBookingInfo,
		chosenRoomId,
	}

}