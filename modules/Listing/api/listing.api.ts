import type {IListingResponse} from "~/modules/Listing/types/response.types";

export class ListingApi {
    static fetchListing(listingId: number): Promise<IListingResponse> {
        return $fetch(`/api/listing/${listingId}`)
    }
}