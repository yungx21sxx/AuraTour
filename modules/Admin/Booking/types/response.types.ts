import type {ListingBookingUserResponse} from "~/modules/Admin/Listing/types/response.types";

export interface BookingItemWithListingAdminResponse {
    id: number;
    status: 'PENDING' | 'CONFIRMED'| 'CANCELLED'| 'COMPLETED',

    createdAt: Date,

    checkIn: Date,
    checkOut: Date,
    daysCount: number,

    userName: string,
    userSurname: string,
    userPhone: string,

    childrens: number;
    comment: string;
    transfer: boolean;
    transferComment: string;
    totalPrice: number,
    prepay: number

    bonusApplied: boolean,
    bonusAppliedCount: number,
    totalPriceWithBonus: number,
    prepayWithBonus: number,

    listing: {
        id: number,
        photo: string,
        title: string;
        city: string,
        address: string
    }

    managedBy: {
        name: string,
        surname: string,
        id: number,
    }

    user: ListingBookingUserResponse | null;

    room: {
        name: string,
        id: number
    } | null,

}