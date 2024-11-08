import type {ListingMapItemResponse} from "~/modules/Search/types/response.types";
import type {BookingInfoDTO} from "~/modules/Booking/types/dto.types";
import type {FiltersDTO} from "~/modules/Search/types/dto.types";
import {useDebounce} from "~/modules/Search/composables/useDebounce";
import useCatalog from "~/modules/Search/composables/useCatalog";


export default () => {
    const mapCatalogIsOpen = useState<boolean>(() => false);
    const mapModalIsOpen = useState<boolean>(() => false);

    const mapListingsList = useState<{
        listings: ListingMapItemResponse[],
        count: number
    }>('map-listings-list');

    const {bookingDTO, filtersDTO} = useCatalog()

    async function fetchMapListingsList() {
        return $fetch('/api/listings/map', {
            method: 'POST',
            body: {
                booking: bookingDTO.value,
                filters: filtersDTO.value,
            }
        })
    }

    async function loadListingsForMap() {
        const {count, listings} = await fetchMapListingsList();
        mapListingsList.value.listings = listings;
        mapListingsList.value.count = count;
    }


    const { debounce } = useDebounce();


    const debouncedRefreshListingList = debounce(async () => {
        mapListingsList.value.listings = []
        await loadListingsForMap();
    }, 400);

    return {
        mapListingsList,
        mapCatalogIsOpen,
        mapModalIsOpen,
        loadListingsForMap,
        debouncedRefreshListingList,
        fetchMapListingsList
    }

}
