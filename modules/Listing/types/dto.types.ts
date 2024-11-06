export interface BookingCreateDTO {
    checkIn: Date;
    checkOut: Date;
    adults: number;
    childrens: number;
    userName: string;
    userSurname: string;
    userPhone: string;
    comment: string;
    transfer: boolean;
    transferComment: string;
    listingId: number;
    roomId: number | null;
    userId: number | null;
    totalPrice: number,
    prepay: number
    daysCount: number,
    bonusApplied?: boolean,
    bonusAppliedCount?: number,
    status: 'PENDING' | 'CONFIRMED'| 'CANCELLED'| 'COMPLETED',
    totalPriceWithBonus?: number,
    prepayWithBonus?: number,
}


export interface ReviewCreateDTO {
    text: string,
    rating: number,
    userName?: string | null,
    listingCheckIn: Date,
    listingCheckOut: Date,
    createdAt?: Date,
    listingId: number
}