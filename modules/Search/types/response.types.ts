import type {IListingItemResponse} from "~/modules/Listing/types/response.types";


export interface IFilterProperty {
    id: number,
    name: string,
    value: string,
    count: number
}

export interface IFiltersResponse {
    priceFrom: number,
    priceTo: number,
    housingTypes: IFilterProperty[],
    amenities: IFilterProperty[],
    foods: IFilterProperty[]
}

export interface IListingCatalogResponse {
    count: number,
    listings: IListingItemResponse[]
}