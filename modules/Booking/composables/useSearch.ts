import type {ISearchData} from "~/modules/Booking/types/response.types";

interface SearchResult {
	regionName: string;
	regionId: number;
	cityName: string;
	cityId: number,
	count: number,
	totalCount: number,
	minPrice: number
}

interface PopularCityWithPhoto extends SearchResult{
	photo: string,

}
const popularCitiesList = ["Гагра", "Пицунда", "Цандрипш", "Гудаута", "Новый Афон", "Сухум"]

const popularCitiesWithPhotoList = [
	{"cityName": "Гагра", "photo": "/popular/gagra.jpg"},
	{"cityName": "Пицунда", "photo": "/popular/picunda.jpg"},
	{"cityName": "Цандрипш", "photo": "/popular/can.jpg"},
	{"cityName": "Гудаута", "photo": "/popular/gudauta.jpg"},
	{"cityName": "Новый Афон", "photo": "/popular/afon.jpg"},
	{"cityName": "Сухум", "photo": "/popular/suhum.jpg"}
]
export default () => {

	const searchQuery = useState<string>('search-query', () => '');
	const searchData = useState<ISearchData[]>('search-data');
	let popularCities = useState<SearchResult[]>('search-popular');
	const allCitiesWithListings = useState<SearchResult[]>('city-with-listings')

	let popularCitiesWithPhoto = useState<PopularCityWithPhoto[]>()


	async function loadSearchData() {
		const {data, error} = await useAsyncData('search-data', () => $fetch('/api/search/init'));
		if (!data.value) return;
		searchData.value = data.value.result;

		//@ts-ignore
		popularCities.value = searchData.value.flatMap(region =>
			region.cities
				.filter(city => popularCitiesList.includes(city.cityName))
				.map(city => ({
					regionName: region.regionName,
					regionId: region.regionId,
					cityName: city.cityName,
					cityId: city.cityId,
					slug: city.slug,
					totalCount: region.totalCount,
					count: city.count,
					minPrice: city.minPrice
				}))
		);
		allCitiesWithListings.value = searchData.value.flatMap(region =>
			region.cities
				.filter(city => city.count > 0)
				.map(city => ({
					regionName: region.regionName,
					regionId: region.regionId,
					cityName: city.cityName,
					cityId: city.cityId,
					totalCount: region.totalCount,
					count: city.count,
					minPrice: city.minPrice
				}))
		);


		//@ts-ignore
		popularCitiesWithPhoto.value = popularCities.value?.map(item => {
			// Находим соответствующий объект во втором массиве
			const match = popularCitiesWithPhotoList.find(item2 => item2.cityName === item.cityName);
			// Возвращаем новый объект, объединяющий поля из обоих объектов
			return {
				...item,
				...match // Это перезаписывает/добавляет поля из match в объект item
			};
		})
	}


	const searchResults = computed<SearchResult[] | null>(() => {
		const query = searchQuery.value.trim().toLowerCase();
		if (!query) return null;


		let results: SearchResult[] = [];
		if (!searchData.value) return null;
		searchData.value.forEach(({ regionName, regionId, cities, totalCount }) => {
			const matchedCities = cities.filter(city => city.cityName.toLowerCase().includes(query));
			if (matchedCities.length > 0) {
				// Для каждого совпадающего города добавляем объект с городом и регионом
				matchedCities.forEach(city => results.push(
					{
						totalCount,
						cityId: city.cityId,
						regionId: regionId,
						regionName,
						cityName: city.cityName,
						count: city.count,
						minPrice: city.minPrice
					}));
			}
		});

		results = results.filter(city => city.count > 0)

		return results.length > 0 ? results : null;
	});


	return {
		searchQuery,
		searchResults,
		popularCities,
		loadSearchData,
		allCitiesWithListings,
		popularCitiesWithPhoto
	};


}