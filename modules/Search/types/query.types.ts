export interface ParsedFiltersQuery {
    priceFrom: number | null,
    priceTo: number | null,
    amenitiesId: number[],
    foodsId: number[],
    housingTypesId: number[],
    minRoomCount: number
}