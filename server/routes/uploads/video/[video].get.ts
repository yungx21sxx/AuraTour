import fs from 'node:fs';
import path from 'path';
import { setHeader } from 'h3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "../../");

export default defineEventHandler(async (event) => {
    let uploadDir = '';
    if (process.env.NODE_ENV === 'development') {
        uploadDir = './videos';
    } else {
        uploadDir = path.join(__dirname, './videos');
    }

    const videoPath = path.join(uploadDir, event.context.params.video);
    if (!fs.existsSync(videoPath)) {
        throw createError({ statusCode: 404, message: 'Видео не найдено' });
    }

    const stats = fs.statSync(videoPath);
    const fileSize = stats.size;
    const range = getRequestHeader(event, 'range'); // Получаем заголовок Range

    if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize || end >= fileSize) {
            throw createError({ statusCode: 416, message: 'Requested Range Not Satisfiable' });
        }

        const chunkSize = end - start + 1;
        const fileStream = fs.createReadStream(videoPath, { start, end });

        setHeader(event, 'Content-Range', `bytes ${start}-${end}/${fileSize}`);
        setHeader(event, 'Accept-Ranges', 'bytes');
        setHeader(event, 'Content-Length', chunkSize);
        setHeader(event, 'Content-Type', 'video/mp4');

        return sendStream(event, fileStream);
    } else {
        // Если заголовка Range нет, отдаем весь файл
        setHeader(event, 'Content-Length', fileSize);
        setHeader(event, 'Content-Type', 'video/mp4');
        return sendStream(event, fs.createReadStream(videoPath));
    }
});