
import useBooking from '~/modules/Booking/composables/useBooking';
import useSearch from '~/modules/Booking/composables/useSearch';

import useCatalog from '~/modules/Search/composables/useCatalog';
import useFilters from '~/modules/Search/composables/useFilters';

import type { IQueryBooking } from '~/modules/Booking/types/query.types';
import type { FiltersDTO } from '~/modules/Search/types/dto.types';

export default async function useSearchPageLogic() {
    const route = useRoute();
    const router = useRouter();

    const {
        setBookingQuery,
        parseBookingRouteQuery,
        bookingModals,
        openSetDateModal,
    } = useBooking();
    const {
        createBookingDTO,
        loadListings,
        listingsList,
        sortBy,
        initListings,
        setFiltersDTO,
    } = useCatalog();
    const { fetchBookingFilters, parseQueryParams } = useFilters();
    const { loadSearchData } = useSearch();

    // Получаем параметры маршрута
    const cityParam = route.params.city as string | undefined;
    const typeParam = route.params.type as string | undefined;

    // Объединяем параметры из маршрута и query
    const query = { ...route.query };

    if (cityParam) {
        query.city = cityParam;
    }

    if (typeParam) {
        query.type = typeParam;
    }

    // Парсим query параметры, связанные с бронированием
    const bookingParameters: IQueryBooking = parseBookingRouteQuery(query);


    // Загружаем данные для поиска города
    await loadSearchData();

    // Устанавливаем данные для бронирования
    setBookingQuery(query);

    // Создаем тело запроса на сервер для фильтрации по информации о бронировании
    createBookingDTO(bookingParameters);

    // Парсим query для фильтрации
    const filtersQueryParameters: FiltersDTO = parseQueryParams(query);

    // Создаем тело запроса на сервер
    setFiltersDTO(filtersQueryParameters);

    // Загружаем параметры фильтрации и инициализируем списки
    await Promise.all([
        fetchBookingFilters(bookingParameters),
        initListings(),
    ]);

    const sortSelect = [
        {
            text: 'По популярности',
            value: 'popularity',
        },
        {
            text: 'Близость к морю',
            value: 'sea-distance',
        },
        {
            text: 'По возрастанию цены',
            value: 'increase',
        },
        {
            text: 'По убыванию цены',
            value: 'decrease',
        },
    ];

    watch(sortBy, () => {
        initListings();
    });

    return {
        listingsList,
        sortBy,
        sortSelect,
        loadListings,
        bookingModals,
        openSetDateModal,
    };
}