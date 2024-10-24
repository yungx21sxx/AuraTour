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