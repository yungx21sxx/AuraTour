import type {LocationQuery} from "vue-router";
import type {IQueryBooking} from "~/modules/Booking/types/query.types";
import {Buffer} from "unenv/runtime/node/buffer/_buffer";
import from = Buffer.from;

interface IBookingModals {
	location: {
		isOpen: boolean,
		slug: null | string,
	},
	typeSlug: null | string,
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
			slug: null,
		},
		typeSlug: null,
		date: {
			isOpen: false,
			from: null,
			to: null,
		}
	}))

	function getPath(params?: {firstLoad: boolean}) {
		const citySlug = bookingModals.value.location.slug;
		const typeSlug = bookingModals.value.typeSlug;

		if (params?.firstLoad) {
			if (citySlug && typeSlug) {
				return `/search/city/${citySlug}/${typeSlug}`;
			} else if (citySlug) {
				return `/search/city/${citySlug}`;
			} else if (typeSlug) {
				return `/search/type/${typeSlug}`;
			} else {
				return `/search`;
			}
		} else {
			if (citySlug) {
				return `/search/city/${citySlug}`;
			} else {
				return `/search`;
			}
		}
	}

	//Это геттер фунция, которая вызываеться в момент когда мы переходим на страницу объекта
	const getBookingQueryLinkParameters = computed(() => {
		const { from: checkIn, to: checkOut } = bookingModals.value.date
		return {
			checkIn: checkIn?.toDateString(),
			checkOut: checkOut?.toDateString(),
			adults: peopleCount.value.adults,
			children: peopleCount.value.children
		}
	})



	//Функция вызываеться для перехода с главной страницы на страницу каталога
	async function goToCatalog(): Promise<void> {
		const { from: checkIn, to: checkOut } = bookingModals.value.date
		await navigateTo({
			path: getPath({firstLoad: true}),
			query: {
				checkIn: checkIn?.toDateString(),
				checkOut: checkOut?.toDateString(),
				adults: peopleCount.value.adults,
				children: peopleCount.value.children,
			},
		}, {
			external: true,
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
	//Это нужно переделать, она парсит query параметры на странице search для инициализации DTO, вырежим все что связано с локацией
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
			// city: routeQuery.city ?? null,
			// cityId: parseInt(<string>routeQuery.cityId) ?? null,
			// region: typeof routeQuery.region === 'string' ? routeQuery.region : '' ?? null,
			// regionId: parseInt(<string>routeQuery.regionId) ?? null,
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
		openSetDateModal,
		closeSetDateModal,
		beautifyDate,
		calculateDaysBetweenDates,
		setBookingQuery,
		parseBookingRouteQuery,
		getBookingQueryLinkParameters,
		getPath
	}

}