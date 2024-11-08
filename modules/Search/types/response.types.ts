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

export interface ISeoPage {
    id: number;
    path: string;
    smallTitle: string;
    photoUrl: string;
    title: string;
    description: string;
    lastModified: Date;
    priority: number;
    changefreq: string;
    isIndexable: boolean;
    city: City | null;
    listingType: ListingType | null;
}

interface City {
    id: number;
    name: string;
    regionId: number;
    slug: string;
}

interface ListingType {
    id: number;
    name: string;
    value: string;
}

export interface ListingMapItemResponse {
    id: number,
    coords: {
        longitude: number
        width: number
    },
    address: string,
    minPrice: number,
    totalPrice: number | null
}