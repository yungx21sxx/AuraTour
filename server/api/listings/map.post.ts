import type {FiltersDTO} from "~/modules/Search/types/dto.types";
import type {BookingInfoDTO} from "~/modules/Booking/types/dto.types";
import listingsService from "~/server/service/listings.service";

export default defineEventHandler(async event => {
    const {filters, booking} = await readBody<{
        filters: FiltersDTO,
        booking: BookingInfoDTO
    }>(event);
    return listingsService.searchFilteredListings(booking, filters, 'popularity', 'map', 1);
})