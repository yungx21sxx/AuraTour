import {fileURLToPath} from "url";
import path from "path";
import fs from "fs";
import {prisma} from "~/server/service/prisma.service";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "../../");

export default defineEventHandler(async event => {
    const videoId = getRouterParam(event, 'videoId');
    const deletedVideo = await prisma.video.delete({
        where: {
            id: parseInt(<string>videoId)
        }
    })
    let uploadDir = ''
    if (process.env.NODE_ENV === 'development') {
        uploadDir = './videos'
    } else {
        uploadDir = path.join(__dirname, '/videos');
    }
    const filePath = uploadDir + '/' + deletedVideo.url.split('/').pop();
    if (!fs.existsSync(filePath)) {
        return createError({
            statusCode: 404,
            message: 'Видео не найдено'
        })
    }
    fs.rmSync(filePath)

    return deletedVideo
})