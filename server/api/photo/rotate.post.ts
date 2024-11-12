import { prisma } from "~/server/service/prisma.service";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import sharp from "sharp";

interface rotateDTO {
    target: 'left' | 'right',
    photoId: number,
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "../../");

export default defineEventHandler(async event => {
    const { target, photoId } = await readBody<rotateDTO>(event);

    // Извлекаем данные изображения из базы данных, включая текущий угол поворота
    const photo = await prisma.photo.findUnique({
        where: {
            id: photoId
        },
        select: {
            id: true,
            urlFull: true,
            urlMin: true,
            rotation: true // Предполагаем, что поле rotation хранит текущий угол
        }
    });

    if (!photo) {
        throw createError({ statusCode: 404, message: 'Фотография не найдена в БД' });
    }

    let uploadDir = process.env.NODE_ENV === 'development' ? './uploads' : path.join(__dirname, './uploads');
    const filePathFull = path.join(uploadDir, path.basename(photo.urlFull));
    const filePathMin = path.join(uploadDir, path.basename(photo.urlMin));

    if (!fs.existsSync(filePathFull) || !fs.existsSync(filePathMin)) {
        throw createError({ statusCode: 404, message: 'Фотография не найдена в файлах' });
    }

    // Определяем угол поворота
    const angleChange = target === 'left' ? -90 : 90;
    const newRotation = (photo.rotation + angleChange + 360) % 360;

    // Применяем поворот к полному изображению и миниатюре, используя временные файлы
    const tempFilePathFull = `${filePathFull}.tmp`;
    const tempFilePathMin = `${filePathMin}.tmp`;

    await sharp(filePathFull)
        .rotate(newRotation)
        .toFile(tempFilePathFull);

    await sharp(filePathMin)
        .rotate(newRotation)
        .toFile(tempFilePathMin);

    // Удаляем исходные файлы и переименовываем временные
    fs.renameSync(tempFilePathFull, filePathFull);
    fs.renameSync(tempFilePathMin, filePathMin);

    // Обновляем угол поворота в базе данных
    await prisma.photo.update({
        where: { id: photoId },
        data: { rotation: newRotation }
    });

    return {
        photoId: photo.id,
        urlMin: photo.urlMin,
        rotation: newRotation
    };
});