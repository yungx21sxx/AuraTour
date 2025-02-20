import {defineEventHandler, H3Event, readMultipartFormData} from "h3";
import path, { join } from "path";
import {fileURLToPath} from "url";
import videoService from "~/server/service/video.service";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "../../");


export default defineEventHandler(async (event: H3Event) => {

    const formData = await readFormData(event);

    const video: File = formData.get('video') as File;
    const title: string = formData.get('title') as string;
    const listingId: string = formData.get('listingId') as string;

    if (video.size > 505848766) {
        return createError({
            message: "Максимальный допустимый размер файла - 500 мб.",
            statusCode: 415
        });
    }
    if (!video.type.startsWith('video')) {
        return createError({
            message: "Файл должен быть видео.",
            statusCode: 415
        });
    }
    return videoService.writeVideo(video, title, parseInt(listingId))
})