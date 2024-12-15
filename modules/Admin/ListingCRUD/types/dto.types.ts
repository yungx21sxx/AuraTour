export interface PricePeriodCreateDTO {
    price: number,
    startDate: Date,
    endDate: Date,
}

export interface RoomCreateDTO {
    id?: number;
    name: string
    places: number
    area: number
    badCount: number
    minPrice: number
    pricePeriods: PricePeriodCreateDTO[]
    amenities: string[]
    photos: {photoId: number, urlMin: string}[];
}

export interface Coords {
    longitude: number | null;
    width: number | null;
}


export interface ListingCreateDTO {
    id?: number;
    title: string;
    description: string;
    minPrice: number;

    cityId: number | null;
    typeId: number | null;

    ownerId: number | null,
    managerId: number | null,

    address: string;
    places: number;
    badCount: number;
    minDaysOrder: number;

    //только если
    flatProperties: {
        elevator: boolean;
        floor: number;
        maxFloor: number;
    };

    seaDistance: number;
    area: number | null;
    coords: Coords;
    amenities: number[];
    foodOptions: number[];
    photos: {photoId: number, urlMin: string}[];
    pricePeriods: PricePeriodCreateDTO[];

    rooms: RoomCreateDTO[]
}