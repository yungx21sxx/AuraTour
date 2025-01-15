
import path from "path";
import {fileURLToPath} from "url";

import type {H3Event, MultiPartData} from "h3";
import photoService from "~/server/service/photo.service";

export default defineEventHandler(async (event: H3Event) => {

	const files: MultiPartData[] | undefined  = await readMultipartFormData(event);

	let uploadedImages = [];

	if (!files) {
		return createError({
			statusCode: 403,
			message: 'Загрузите фотки'
		})
	}


	for (let file of files) {
		if (!file.type) continue;
		const [type, ext] = file.type.split("/")
		if (type !== "image") {
			return createError({
				statusCode: 403,
				message: 'Загружать можно только фотки'
			});
		}
		try {
			const photo = await photoService.writePhoto(file);
			uploadedImages.push(photo)
		} catch (e) {
			console.log(e)
			return createError({
				statusCode: 403,
				message: 'Возможно одна из фоток в неправильном формате'
			})
		}
	}

	return uploadedImages;
});