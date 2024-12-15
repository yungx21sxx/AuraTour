export interface BookingInfoDTO {
	regionId: number | null,
	cityId: number | null,
	checkIn: Date,
	checkOut: Date,
	peoples: number
}

export interface FetchSimilarListingsDTO {
	typeId: number,
	listingId: number
}


export interface FiltersDTO {
	priceFrom: number,
	priceTo: number,
	amenitiesId: number[],
	foodsId: number[],
	housingTypesId: number[],
	minRoomCount: number
}

export interface GetAvailableListingsDTO {
	booking: BookingInfoDTO,
	filters: FiltersDTO | null,
	sortBy: 'increase' | 'decrease' | 'popularity' | 'sea-distance'
}


export interface AdminLoginDTO {
	login: string,
	password: string,
}

export interface UserLoginDTO {
	phone: string,
	phoneRaw: string,
	otp: number,
}

export interface createOtpDTO {
	phoneRow: string,
}


export interface UserUpdateDTO {
	id: number,
	name: string | null,
	surname: string | null,
	patronymic: string | null
}


export interface ReviewCreateDTO {
	listingId: number;
	comment: string;
	rating: number;
	userId: number | null;
	userName: string;
}



export interface BookingCreateDTO {
	startDate: Date;
	endDate: Date;
	adults: number;
	childrens: number;
	surname: string;
	name: string;
	comment: string;
	phone: string;
	transfer: boolean;
	transferComment: string;
	listingId: number;
	roomId: number | null;
	userId: number | null;
	totalPrice: number,
	prepay: number
}

interface Coords {
	longitude: number | null;
	width: number | null;
}
export interface ListingCreateDTO {
	id?: number;
	title: string;
	description: string;
	minPrice: number;

	cityId: number;
	typeId: number;

	ownerId: number | null,
	managerId: number | null,

	address: string;
	places: number;
	badCount: number;
	minDaysOrder: number;

	//только если
	flatProperties: {
		elevator: boolean;
		floor: number;
		maxFloor: number;
	} | null;

	seaDistance: number;
	area: number | null;
	coords: Coords;
	amenities: number[];
	foodOptions: number[];
	photos: {photoId: number, urlMin: string}[];
	pricePeriods: PricePeriodCreateDTO[];

	rooms: RoomCreateDTO[]

}

export interface RoomCreateDTO {
	id?: number;
	name: string
	places: number
	area: number
	badCount: number
	minPrice: number
	pricePeriods: PricePeriodCreateDTO[]
	amenities: string[]
	photos: {photoId: number, urlMin: string}[];
}

export interface PricePeriodCreateDTO {
	price: number,
	startDay: number,
	endDay: number,
	startMonth: number,
	endMonth: number
}
