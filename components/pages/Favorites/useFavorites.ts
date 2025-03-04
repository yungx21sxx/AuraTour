import type {IListingPreviewResponse} from "~/types/response.types";
import useStatistics from "~/modules/Common/useStatistics";
import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";

export default () => {
	const favoriteListingIDs = useState<number[]>('favorite',() => [])

	const saveChanges = (listings: number[]) => localStorage.setItem('favorites', JSON.stringify(listings));

	const authUser = useAuthUser()

	const addToFavorites = (listingId: number) => {
		favoriteListingIDs.value.push(listingId);
		saveChanges(favoriteListingIDs.value);

		const {incrementStatistic} = useStatistics();

		incrementStatistic('favorites', listingId)
	}

	const removeFromFavorites = (listingId: number) => {
		favoriteListingIDs.value = favoriteListingIDs.value.filter(i => i !== listingId);
		saveChanges(favoriteListingIDs.value)
	}

	const getLocaleStoreData = (): number[] | null => {
		const listingsJSON = localStorage.getItem('favorites');

		if (!listingsJSON) return null;
		const listings = JSON.parse(listingsJSON);

		listings.map((i: any) => {
			if (typeof i !== 'number') {
				favoriteListingIDs.value = []
				localStorage.removeItem('favorites')
			}
		})

		//@ts-ignore
		favoriteListingIDs.value = listings
		return listings
	}

	onMounted(() => {
		getLocaleStoreData();
	})




	return {
		addToFavorites,
		removeFromFavorites,
		favoriteListingIDs,
		getLocaleStoreData
	}

}