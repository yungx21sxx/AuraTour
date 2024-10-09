import type {LocationQuery} from "vue-router";
import type {IQueryBooking} from "~/types/query.types";

interface IBookingModals {
	location: {
		isOpen: boolean,
		location: null | ChosenLocation,
		housingTypesId: number[]
	},
	date: {
		isOpen: boolean
		from: Date | null,
		to: Date | null,
	}
}



interface IPeopleCount {
	adults: number,
	children: number
}
interface ChosenLocation {
	regionName: string;
	regionId: number,
	cityName: string ; // cityName является необязательным, так как результат может быть только регионом
	cityId: number;
}

export default () => {

	const peopleCountDefault = {
		adults: 2,
		children: 0
	}
	const peopleCount = useState<IPeopleCount>(() => ({
		...peopleCountDefault
	}));


	const bookingModals = useState<IBookingModals>(() => ({
		location: {
			isOpen: false,
			location: null,
			housingTypesId: []
		},
		date: {
			isOpen: false,
			from: null,
			to: null,
		}
	}))

	const getBookingQueryLinkParameters = computed(() => {
		const { from: checkIn, to: checkOut } = bookingModals.value.date
		const { location } = bookingModals.value.location
		return {
			checkIn: checkIn?.toDateString(),
			checkOut: checkOut?.toDateString(),
			region: location?.regionName,
			regionId: location?.regionId,
			city: location?.cityName || null,
			cityId: location?.cityId || null,
			adults: peopleCount.value.adults,
			children: peopleCount.value.children
		}
	})

	async function goToCatalog(): Promise<void> {
		const { from: checkIn, to: checkOut } = bookingModals.value.date
		const { location } = bookingModals.value.location
		await navigateTo({
			path: '/search',
			query: {
				checkIn: checkIn?.toDateString(),
				checkOut: checkOut?.toDateString(),
				region: location?.regionName,
				regionId: location?.regionId,
				city: location?.cityName || null,
				cityId: location?.cityId || null,
				adults: peopleCount.value.adults,
				children: peopleCount.value.children,
				housingTypesId: bookingModals.value.location.housingTypesId
			},
			replace: true,
			force: true
		})
	}

	function getDefaultDates(): {today: Date, dayAfterTomorrow: Date} {
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		const dayAfterTomorrow = new Date(today);
		dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 4);

		return {today, dayAfterTomorrow}
	}

	const describedGroup = computed<string>(() => {

		const { adults, children } = peopleCount.value
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
		const childrenStr = children > 0 ? `, ${children} ${pluralize(children, ['ребенок', 'ребенка', 'детей'])}` : '';

		return `${adultsStr}${childrenStr}`;
	})

	function beautifyDate(dateInput: Date): string {
		const date = new Date(dateInput);
		const now = new Date();
		const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
			month: 'short',
			day: 'numeric',
			year: now.getFullYear() === date.getFullYear() ? undefined : 'numeric',
		});
		return dateFormatter.format(date).replace('.', '');
	}
	function getDaysWord(days: number): string {
		if (days % 10 === 1 && days % 100 !== 11) {
			return 'день';
		} else if (days % 10 >= 2 && days % 10 <= 4 && (days % 100 < 10 || days % 100 >= 20)) {
			return 'дня';
		} else {
			return 'дней';
		}
	}
	function calculateDaysBetweenDates(startDate: Date, endDate: Date): string {
		const oneDay = 24 * 60 * 60 * 1000; // Количество миллисекунд в одном дне
		const differenceInTime = endDate.getTime() - startDate.getTime();
		const days =  Math.round(differenceInTime / oneDay);
		return `${days} ${getDaysWord(days)}`
	}

	function parseBookingRouteQuery(routeQuery: LocationQuery): IQueryBooking {
		const parseDate = (date: string | null) => date ? new Date(date) : null;
		const getNumber = (value: string | (string | null)[] | null) => {
			if (Array.isArray(value)) {
				return parseInt(value[0] || '0', 10) ;
			}
			return parseInt(value || '0', 10);
		};

		const {today, dayAfterTomorrow} = getDefaultDates()

		return <IQueryBooking>{
			adults: routeQuery.adults ? getNumber(routeQuery.adults) : 2,
			checkIn: parseDate(routeQuery.checkIn as string) ?? null,
			checkOut: parseDate(routeQuery.checkOut as string) ?? null,
			children: getNumber(routeQuery.children),
			city: routeQuery.city ?? null,
			cityId: parseInt(<string>routeQuery.cityId) ?? null,
			region: typeof routeQuery.region === 'string' ? routeQuery.region : '' ?? null,
			regionId: parseInt(<string>routeQuery.regionId) ?? null,
		};
	}

	function setBookingQuery(query: LocationQuery) {
		const parsedQuery: IQueryBooking = parseBookingRouteQuery(query);
		if (parsedQuery.region && parsedQuery.city && parsedQuery.regionId && parsedQuery.cityId) {
			bookingModals.value.location.location = {
				regionName: parsedQuery.region,
				cityName: parsedQuery.city,
				regionId: parsedQuery.regionId,
				cityId: parsedQuery.cityId
			};
		} else {
			bookingModals.value.location.location = null
		}

		bookingModals.value.date.from = parsedQuery.checkIn
		bookingModals.value.date.to = parsedQuery.checkOut
		peopleCount.value = {
			adults: parsedQuery.adults,
			children: parsedQuery.children
		}
	}


	const openLocationModal = () => {
		bookingModals.value.location.isOpen = true
	}

	const closeLocationModal = (location: ChosenLocation | null) => {
		bookingModals.value.location.isOpen = false
		if (location)
			bookingModals.value.location.location = location
	}

	const openSetDateModal = () => {
		bookingModals.value.date.isOpen = true
	}

	const closeSetDateModal = (checkIn?: Date, checkOut?: Date) => {
		bookingModals.value.date.isOpen = false;

		if (!checkIn || !checkOut) return;

		bookingModals.value.date.from = checkIn;
		bookingModals.value.date.to = checkOut;
	}

	return {
		peopleCount,
		bookingModals,
		goToCatalog,
		describedGroup,
		openLocationModal,
		closeLocationModal,
		openSetDateModal,
		closeSetDateModal,
		beautifyDate,
		calculateDaysBetweenDates,
		setBookingQuery,
		parseBookingRouteQuery,
		getBookingQueryLinkParameters,
	}

}