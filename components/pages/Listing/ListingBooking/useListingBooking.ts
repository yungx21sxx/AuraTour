import type {LocationQuery} from "vue-router";
import type {IQueryBooking} from "~/types/query.types";
import type {BookingResponse} from "~/types/response.types";
interface IPeopleCount {
	adults: number,
	children: number
}

interface IDateModal {
	isOpen: boolean
	from: Date | null,
	to: Date | null,
}
export default () => {
	const peopleCountDefault = {
		adults: 2,
		children: 0
	}
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
		from: null,
		to: null,
	}));

	const getListingQueryLinkParameters = computed(() => {
		const { from: checkIn, to: checkOut } = dateModal.value
		return {
			checkIn: checkIn?.toDateString(),
			checkOut: checkOut?.toDateString(),
			adults: peopleCount.value.adults,
			children: peopleCount.value.children
		}
	})

	function setBookingQuery(parsedQuery: IQueryBooking) {
		dateModal.value.from = parsedQuery.checkIn ?? null
		dateModal.value.to = parsedQuery.checkOut ?? null
		peopleCount.value = {
			adults: parsedQuery.adults === 0 ? 2 : parsedQuery.adults,
			children: parsedQuery.children
		}
	}

	const openSetDateModal = () => {
		dateModal.value.isOpen = true
	}

	const closeSetDateModal = (checkIn?: Date, checkOut?: Date) => {


		if (!checkIn || !checkOut) {
			dateModal.value.isOpen = false;
			return;
		}

		dateModal.value.from = checkIn;
		dateModal.value.to = checkOut;
		dateModal.value.isOpen = false;


	}
	return {
		peopleCount,
		dateModal,
		setBookingQuery,
		openSetDateModal,
		closeSetDateModal,
		getListingQueryLinkParameters,
		listingBookingConfirmModal,
		describeGroup
	}

}