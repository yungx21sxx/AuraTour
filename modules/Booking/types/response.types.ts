
export interface ICitySearchItem {
    id: number;
    cityName: string;
    regionName: string;
    slug: string;
    listingsCount: number
    minPrice: number;
    seoPage: boolean;
}

export interface IListingTypeSearchItem {
    id: number;
    name: string;
    slug: string;
    listingsCount: number
    minPrice: number;
    seoPage: boolean;
}

export interface ISearchInitResponse {
    cities: ICitySearchItem[];
    listingTypes: IListingTypeSearchItem[];
}