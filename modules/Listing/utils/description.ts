import type {IListingResponse} from "~/modules/Listing/types/response.types";

export const generateSeoDescription = (listing: IListingResponse): string => {
    const parts: string[] = [];

    // Основные данные
    parts.push(`${listing.city.name}, ${listing.type.name}`);
    if (listing.address) parts.push(`Адрес: ${listing.address}`);
    if (listing.seaDistance) parts.push(getSeaDistance(listing.seaDistance));

    // Цены
    const minPrice = listing.rooms.length
        ? Math.min(...listing.rooms.map(r => r.minPrice))
        : listing.minPrice;
    parts.push(`Цена: от ${Math.round(minPrice).toLocaleString('ru-RU')}₽ за ночь`);

    // Номера или характеристики
    if (listing.rooms.length > 0) {
        parts.push(...getRoomsList(listing.rooms));
    } else {
        if (listing.places) parts.push(`Количество мест: ${listing.places}`);
        if (listing.area) parts.push(`Площадь: ${listing.area} м²`);
    }

    // Питание
    if (listing.food?.length) {
        parts.push(`Варианты питания: ${listing.food.join(', ')}`);
    }

    return parts.join('. ').slice(0, 320);
};

const getSeaDistance = (meters: number): string => {
    const forms = ['метр', 'метра', 'метров'];
    const n = Math.abs(meters) % 100;
    const n1 = n % 10;
    const formIndex = (n > 10 && n < 20) ? 2 : [2, 0, 1, 1, 1, 2][Math.min(n1, 5)];
    return `Расстояние до моря: ${meters} ${forms[formIndex]}`;
};

const getRoomsList = (rooms: IRoomResponse[]): string[] => {
    const roomDetails = rooms.slice(0, 3).map(room =>
        `${room.name} (${room.places} мест, от ${room.minPrice.toLocaleString('ru-RU')}₽)`
    );
    return ['Доступные номера:', ...roomDetails];
};