import type {FiltersDTO} from "~/modules/Search/types/dto.types";
import type {BookingInfoDTO} from "~/modules/Booking/types/dto.types";
import {prisma} from "~/server/service/prisma.service";
import ListingsService from "~/server/service/listings.service";

export default defineEventHandler(async event => {
    const userId = parseInt(event.context.params.userId)
    return ListingsService.getUserListings(userId);
})

