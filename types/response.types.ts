

export interface ISearchData {
	regionId: number,
	regionName: string,
	cities: City[],
	totalCount: number,
}

interface City {
	cityId: number,
	cityName: string,
	count: number,
	minPrice: number
}

export interface IFilterProperty {
	id: number,
	name: string,
	value: string,
	count: number
}

export interface IFiltersResponse {
	priceFrom: number,
	priceTo: number,
	housingTypes: IFilterProperty[],
	amenities: IFilterProperty[],
	foods: IFilterProperty[]
}

export interface IListingPreviewResponse {
	address: string,
	city: string,
	id: number,
	photos: string[],
	places: number,
	dailyPrice: number,
	totalPrice: number | null,
	area: number,
	title: string,
	type: string,
	seaDistance: number,
	reviewCount: number,
	averageRating: number,
	minPrice: number,
	badCount: number,
	amenities: string[],
	isHotelType: boolean
}

export interface IPhoto {
	id: number,
	urlFull: string,
	urlMin: string,
	position: number
}

export interface IListingResponse {
	address: string,
	amenities: string[],
	city: string,
	cityId: number,
	region: string,
	regionId: number,
	description: string,
	food: string[],
	id: number,
	minPrice: number,
	photos: IPhoto[],
	places: number,
	dailyPrice: number,
	totalPrice: number,
	area: number,
	title: string,
	type: string,
	seaDistance: number,
	badCount: number,
	floor: number,
	maxFloor: number,
	elevator: boolean,
	daysCount: number,
	rooms: IGuestHouseRoom[],
	minDaysOrder: number,
	coords: [number, number],
	reviewCount: number,
	averageRating: number
	typeId: number
	phone: string
	phoneRaw: string
	renterName: string
}

export interface IReview {
	id: number;
	comment: string;
	rating: number;
	listingId: number;
	userId?: number;
	userName: string;
	userFrom: string;
	createdAt: Date;
}


export interface IGuestHouseRoom {
	id: number,
	name: string,
	amenities: string[]
	totalPrice: number,
	dailyPrice: number,
	photos: IPhoto[],
	places: number
	area: number
	badCount: number
}




export interface IListingCatalogResponse {
	count: number,
	listings: IListingPreviewResponse[]
}

export interface UserAuthResponse {
	id: number,
	name?: string | null | undefined,
	surname?: string | null  | undefined,
	patronymic?: string | null | undefined,
	phone: string;
	phoneRow: string;
	role: 'ADMIN' | 'USER'
}

export interface CreateOtpResponse {
	phoneRow: string
}

export interface UserResponse {
	id: number;
	phone: string;
	phoneRow: string;
	name: string | null;
	createdAt: Date;
	balance: number;
}


export interface CreateOtpResponse {
	phoneRow: string
}


export interface BookingResponse {
	id: number;
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
	room: null | {name: string}
	userId: number | null;
	listing: {title: string},
	totalPrice: number,
	prepay: number
}

export type InitialDataResponse = {
	cities: { id: number; name: string; regionId: number }[];
	amenities: { id: number; name: string; value: string }[];
	foodOptions: { id: number; name: string; value: string }[];
	housingTypes: { id: number; name: string; value: string }[];
};

export interface housingTypesResponse { id: number; name: string; value: string, count: number }


export interface PhotoUploadResponse {
	photoId: number,
	urlMin: string,
}