import type {BookingCreateDTO} from "~/modules/Listing/types/dto.types";
import type {ListingBookingItemAdminResponse} from "~/modules/Admin/Listing/types/response.types";

export class ListingBookingApi {
    static fetchBookings(listingId: number):
        Promise<{
            bookings: ListingBookingItemAdminResponse[]
        }>
    {
        return $fetch(`/api/bookings/listing/${listingId}`)
    }

    static createBooking(dto: BookingCreateDTO) {
        return $fetch('/api/bookings/create', {
            method: "POST",
            body: dto
        })
    }

    static updateBooking(dto: BookingCreateDTO, bookingId: number) {
        return $fetch(`/api/bookings/update/${bookingId}`, {
            method: "PUT",
            body: dto
        })
    }
}