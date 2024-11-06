export interface ListingBookingItemAdminResponse {
    id: number;
    status: 'PENDING' | 'CONFIRMED'| 'CANCELLED'| 'COMPLETED',

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

    user: ListingBookingUserResponse | null

    room: {
        name: string,
        id: number
    } | null,

}

export interface ListingBookingUserResponse {
    id: number,
    name: string,
    surname: string,
    email: string,
    phone: string,
    bonusPoints: true
}
