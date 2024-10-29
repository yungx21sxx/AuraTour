import type {ICitySearchItem, ISearchInitResponse, IListingTypeSearchItem} from "~/modules/Booking/types/response.types";

interface IPopularCityWithPhoto extends ICitySearchItem {
	photo: string,
}


const popularCitiesWithPhotoList = [
	{"cityName": "Гагра", "photo": "/popular/gagra.jpg"},
	{"cityName": "Пицунда", "photo": "/popular/picunda.jpg"},
	{"cityName": "Цандрипш", "photo": "/popular/can.jpg"},
	{"cityName": "Гудаута", "photo": "/popular/gudauta.jpg"},
	{"cityName": "Новый Афон", "photo": "/popular/afon.jpg"},
	{"cityName": "Сухум", "photo": "/popular/suhum.jpg"}
]

function mergeCityData(popularCities, cityData): IPopularCityWithPhoto[] {
	return popularCities.map(city => {
		const matchedCity = cityData.find(data => data.cityName === city.cityName);
		return matchedCity
			? { ...city, ...matchedCity }
			: city; // Возвращаем исходный объект, если совпадение не найдено
	});
}

export default () => {

	const searchData = useState<ISearchInitResponse>('search-data');
	const chosenCity = useState<ICitySearchItem | null>('chosen-city', () => null);
	const popularCitiesWithPhoto = useState<IPopularCityWithPhoto[]>('popular-cities');

	async function loadSearchData() {
		try {
			searchData.value = await $fetch<ISearchInitResponse>('/api/search/init');
		} catch (error) {
			throw error;
		}
		popularCitiesWithPhoto.value = mergeCityData(popularCitiesWithPhotoList, searchData.value.cities);
	}

	const setChosenCity = (city: ICitySearchItem) => {
		chosenCity.value = city;
	}

	const setChosenCityBySlug = (slug: string | null) => {
		if (!slug) return;
		const searchedCity = searchData.value.cities.find(data => data.slug === slug);
		if (searchedCity) {
			chosenCity.value = searchedCity;
		}
	}

	const getChosenTypeBySlug = (slug: string): IListingTypeSearchItem | null => {
		const searchedType = searchData.value.listingTypes.find(data => data.slug === slug);
		if (!searchedType) return null;
		return searchedType;
	}

	return {
		searchData,
		loadSearchData,
		popularCitiesWithPhoto,
		setChosenCityBySlug,
		chosenCity,
		setChosenCity,
		getChosenTypeBySlug,
	};


}