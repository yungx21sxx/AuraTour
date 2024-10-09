import filtersService from "~/server/service/filters.service";

export default defineEventHandler(async (event) => {
	const cityId = getRouterParam(event, 'cityId')
	return filtersService.loadHousingTypes(parseInt(<string>cityId))
})