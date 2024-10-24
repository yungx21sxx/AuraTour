export interface housingTypesResponse { id: number; name: string; value: string, count: number }

interface City {
    cityId: number,
    cityName: string,
    count: number,
    minPrice: number
}

export interface ISearchData {
    regionId: number,
    regionName: string,
    cities: City[],
    totalCount: number,
}