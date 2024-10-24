import type {IPhoto} from "~/types/response.types";

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