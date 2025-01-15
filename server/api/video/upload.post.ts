import { defineEventHandler, readMultipartFormData } from "h3";
import path, { join } from "path";
import {fileURLToPath} from "url";
import videoService from "~/server/service/video.service";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "../../");


export default defineEventHandler(async (event) => {

        // Читаем данные из FormData
    const formData = await readMultipartFormData(event);
    if (!formData) {
        throw new Error("Нет данных для обработки.");
    }

    // Находим файл видео
    const videoFile = formData.find(
        (field) => field.filename && field.type.startsWith("video")
    );

    if (!videoFile) {
        return createError({
            message: "Файл должен быть видео.",
            statusCode: 415
        });
    }

    let title: string;

    for (const field of formData) {
        if (field.name === 'title') {
            title = field.data.toString();
        }
    }

    return videoService.writeVideo(videoFile, title)
})