export interface IPhoto {
    id: number,
    urlFull: string,
    urlMin: string,
    position: number
}

export interface IListingItemResponse {
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


export interface IHotelRoom {
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



export interface IListingOwner {
    name: string,
    surname: string,
    phone: string,
    email: string,
}



export interface IReviewResponse {
    id: number;
    rating: number;
    text: string;
    listingCheckIn: Date,
    listingCheckOut: Date,
    isAdminCreated: boolean,
    userName: string | null
    user: {
        id: number,
        name: string,
    } | null
    createdAt: Date;
}


export interface IVideoResponse {
    title: string;
    formatedDuration: string;
    url: string;
    id: number;
}

export interface IListingPricePeriod {
    price: number,
    startDay: number,
    endDay: number,

    startMonth: number,
    endMonth: number
}

export interface IRoomResponse {
    id: number,
    name: string,
    places: number,
    extraPlaces: number
    area: number,
    badCount: number,
    minPrice: number
    pricePeriods: IListingPricePeriod[],
    amenities: string[]
    photos: IPhoto[]
    includedDescription: string | null
    calculatedPrices: {
        totalPrice: number,
        dailyPrice: number,
        daysCount: number
    } | null;
}

export interface IListingManager {
    name: string,
    phone: string,
    avatar: string
}

export interface IListingResponse {
    id: number,
    isHotelType: boolean,
    note: string | null,
    title: string,
    description: string,
    validated: boolean,

    photos: IPhoto[],

    minPrice: number,
    pricePeriods: IListingPricePeriod[]
    minDaysOrder: number

    address: number,
    city: {
        name: string,
        slug: string,
    };
    coords: {
        longitude: number,
        width: number
    }
    seaDistance: number,

    badCount: string,
    flatProperties: {
        floor: number,
        maxFloor: number,
        elevator: boolean
    } | null;
    places: string,
    area: number,
    food: string[]
    infrastructure: string[]
    foodDescription: string

    manager: IListingManager,
    owner: IListingOwner | null,
    type: {
        name: string,
        value: string
    },
    amenities: string[],

    calculatedPrices: {
        totalPrice: number,
        dailyPrice: number,
        daysCount: number
    } | null;

    rooms: IRoomResponse[] | [];

    videos: IVideoResponse[];

    reviewCount: number,
    averageRating: number,
}