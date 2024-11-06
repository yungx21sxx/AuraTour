import type {BookingInfoDTO} from "~/types/dto.types";
import type {IQueryBooking} from "~/modules/Booking/types/query.types";
import {ListingApi} from "~/modules/Listing/api/listing.api";
import {type IListingResponse} from "~/modules/Listing/types/response.types";
import {calculatePrices} from "~/modules/Listing/utils/calculatePrices";

export default () => {
	const listing = useState<IListingResponse>('listing-data');
	const queryForGoBack = useState();

	async function initListingData(listingId: number, bookingQuery: IQueryBooking) {
		const listingResponse: IListingResponse = await ListingApi.fetchListing(listingId);
		console.log(listingResponse)
		if (bookingQuery.checkIn && bookingQuery.checkOut) {
			const {checkIn, checkOut } = bookingQuery;
			const {pricePeriods, minPrice} = listingResponse;
			listingResponse.calculatedPrices = calculatePrices(
				pricePeriods, minPrice, checkIn, checkOut
			)

			if (listingResponse.rooms.length > 0) {
				listingResponse.rooms.forEach(room => {
					room.calculatedPrices = calculatePrices(room.pricePeriods, room.minPrice, checkIn, checkOut)
				})
			}
		}

		listing.value = listingResponse
	}

	function updateListingPrices(checkIn: Date, checkOut: Date) {
		const {pricePeriods, minPrice} = listing.value;

		listing.value.calculatedPrices = calculatePrices(
			pricePeriods, minPrice, checkIn, checkOut
		);
		if (listing.value.rooms.length > 0) {
			listing.value.rooms.forEach(room => {
				room.calculatedPrices = calculatePrices(room.pricePeriods, room.minPrice, checkIn, checkOut);
			});
		}
	}

	return {
		listing,
		initListingData,
		updateListingPrices,
		queryForGoBack
	}
}