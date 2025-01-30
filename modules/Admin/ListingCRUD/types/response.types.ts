export type InitialDataResponse = {
    cities: { id: number; name: string; regionId: number }[];
    amenities: { id: number; name: string; value: string }[];
    foodOptions: { id: number; name: string; value: string }[];
    infrastructure: { id: number; name: string; value: string }[];
    housingTypes: { id: number; name: string; value: string }[];
    managers: {id: number; fullName: string}[]
};

export interface PhotoUploadResponse {
    photoId: number,
    urlMin: string,
}

export interface VideoUploadResponse {
    formatedDuration: string;
    videoId: number;
    url: string;
    title: string;
}