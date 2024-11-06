import type {PricePeriodCreateDTO} from "~/modules/Admin/ListingCRUD/types/dto.types";

export interface RoomCreateFormData {
    id: number,
    name: string | null
    places: number | null
    area: number | null
    badCount: number | null
    minPrice: number | null
    pricePeriods: PricePeriodCreateDTO[]
    amenities: string[]
    photos: {photoId: number, urlMin: string}[];
}

export interface Coords {
    longitude: number | null;
    width: number | null;
}


export interface ListingCreateFormData {
    title: string | null;
    description: string | null;
    minPrice: number | null;

    cityId: number | null;
    typeId: number | null;

    ownerId: number | null,
    managerId: number | null,

    address: string | null;
    places: number | null;
    badCount: number | null;
    minDaysOrder: number | null;

    //только если
    flatProperties: {
        elevator: boolean;
        floor: number | null;
        maxFloor: number | null;
    };

    seaDistance: number | null;
    area: number | null;
    coords: Coords;
    amenities: number[];
    foodOptions: number[];
    photos: {photoId: number, urlMin: string, position?: number}[];
    pricePeriods: PricePeriodCreateDTO[];

    rooms: RoomCreateFormData[]

}