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

export interface IFiltersInput extends Omit<FiltersDTO, 'priceFrom' | 'priceTo'>{
    priceRange: [number, number]
}


export interface GetAvailableListingsDTO {
    booking: BookingInfoDTO,
    filters: FiltersDTO,
    sortBy: 'increase' | 'decrease' | 'popularity' | 'sea-distance',
    managerId: null | number
}

export interface FiltersRefreshBookingInfoDTO {
    cityId: number | null,
    checkIn: Date | null,
    checkOut: Date | null,
}

export interface GetRefreshedFiltersDTO {
    booking: FiltersRefreshBookingInfoDTO,
    filters: FiltersDTO,
}
