import type {BookingInfoDTO} from "~/modules/Booking/types/dto.types"

export interface FiltersDTO {
    priceFrom: number,
    priceTo: number,
    amenitiesId: number[],
    foodsId: number[],
    housingTypesId: number[],
    minRoomCount: number
}


export interface GetAvailableListingsDTO {
    booking: BookingInfoDTO,
    filters: FiltersDTO | null,
    sortBy: 'increase' | 'decrease' | 'popularity' | 'sea-distance'
}
