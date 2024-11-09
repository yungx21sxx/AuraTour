import ListingsService from "~/server/service/listings.service";

export default defineEventHandler(async event => {
    return ListingsService.getListingsForModeration()
})