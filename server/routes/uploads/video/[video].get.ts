import fs from 'node:fs';
import path from 'path';
import { setHeader, sendStream } from 'h3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "../../");

export default defineEventHandler(async (event) => {
    try {
        let uploadDir = process.env.NODE_ENV === 'development' ? './videos' : path.join(__dirname, './videos');
        const videoPath = path.join(uploadDir, event.context.params.video);

        if (!fs.existsSync(videoPath)) {
            return  createError({ statusCode: 404, message: 'Видео не найдено' });
        }
        const stats = fs.statSync(videoPath);
        const fileSize = stats.size;
        const range = getRequestHeader(event, 'range');

        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            if (start >= fileSize || end >= fileSize) {
                return  createError({ statusCode: 416, message: 'Requested Range Not Satisfiable' });
            }

            const chunkSize = end - start + 1;
            const fileStream = fs.createReadStream(videoPath, { start, end });

            setHeader(event, 'Content-Range', `bytes ${start}-${end}/${fileSize}`);
            setHeader(event, 'Accept-Ranges', 'bytes');
            setHeader(event, 'Content-Length', chunkSize);
            setHeader(event, 'Content-Type', 'video/mp4');
            setResponseStatus(event, 206)
            return sendStream(event, fileStream);
        } else {
            setHeader(event, 'Content-Length', fileSize);
            setHeader(event, 'Content-Type', 'video/mp4');
            setResponseStatus(event, 206)
            return sendStream(event, fs.createReadStream(videoPath));
        }
    } catch (error) {
        console.error('Error while processing video:', error.message);
        throw createError({ statusCode: 500, message: 'Произошла ошибка при обработке видео' });
    }
});