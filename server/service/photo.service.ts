import path from "path";
//@ts-ignore
import * as uuid from "uuid";
import fs from "fs";
import sharp from "sharp";
import {fileURLToPath} from "url";
import {prisma} from "~/server/service/prisma.service";
import type {PhotoUploadResponse} from "~/types/response.types";
import {MultiPartData} from "h3";
import heicConvert from "heic-convert";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "../../");

class PhotoService {
	createFileUrl() {
		const staticUrl = '/uploads/'
		const photoHash = uuid.v4()
		const fileNameFull = photoHash + '.webp'
		const fileNameMin = photoHash + '-min.webp'
		let uploadDir = ''

		if (process.env.NODE_ENV === 'development') {
			uploadDir = './uploads'
		} else {
			uploadDir = path.join(__dirname, '/uploads');
		}
		return {
			urlMin: staticUrl + fileNameMin,
			urlFull: staticUrl + fileNameFull,
			filePathFull: uploadDir + '/' + fileNameFull,
			filePathMin: uploadDir + '/' + fileNameMin,
			uploadDir
		}
	}
	async writePhoto(file: MultiPartData): Promise<PhotoUploadResponse | null> {
		const {urlMin, urlFull, filePathFull, filePathMin, uploadDir} = this.createFileUrl()

		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, '0777');
		}

		try {
			let fileBuffer: Buffer;
			if (file.filename.split('.')[1].toLowerCase() === 'heic') {
				fileBuffer = await heicConvert({
					buffer: file.data,
					format: "JPEG"
				})
			} else {
				fileBuffer = file.data;
			}
			const image = sharp(fileBuffer);
			const { width, height } = await image.metadata();

			if (!width || !height) return null;

			const isPortrait = height > width;
			let resizeOptions: sharp.ResizeOptions | null;
			let resizeOptionsMin: sharp.ResizeOptions | null;

			if (isPortrait) {
				resizeOptions = height > 1080 ? { height: 1080, fit: 'inside' } : null;
			} else {
				resizeOptions = width > 1920 ? { width: 1920, fit: 'inside' } : null;
			}

			if (resizeOptions) {
				await image.resize(resizeOptions).webp({ quality: 80 }).toFile(filePathFull);
			} else {
				await image.webp({ quality: 80 }).toFile(filePathFull);
			}
			await image.resize({ width: 500, height: 500, fit: 'cover' }).webp({ quality: 70 }).toFile(filePathMin);

			const photo = await prisma.photo.create({
				data: {
					urlFull,
					urlMin
				}
			})

			return {
				photoId: photo.id,
				urlMin,
			}

		} catch (e: any) {
			console.log(e)
			throw new Error(e)
		}

	}
}

export default new PhotoService()