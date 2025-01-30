import type {BookingInfoDTO} from "~/modules/Booking/types/dto.types"

export interface FiltersDTO {
    priceFrom: number | null,
    priceTo: number | null,
    amenitiesId: number[],
    foodsId: number[],
    housingTypesId: number[],
    minRoomCount: number | null,
    infrastructureId: number[]
}


export interface GetAvailableListingsDTO {
    booking: BookingInfoDTO,
    filters: FiltersDTO,
    sortBy: 'increase' | 'decrease' | 'popularity' | 'sea-distance',
    managerId: null | number
}
