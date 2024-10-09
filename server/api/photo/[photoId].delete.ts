import {fileURLToPath} from "url";
import path from "path";
import fs from "fs";
import {prisma} from "~/server/service/prisma.service";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "../../");
export default defineEventHandler(async event => {
	const photoId = getRouterParam(event, 'photoId');
	const deletedPhoto = await prisma.photo.delete({
		where: {
			id: parseInt(<string>photoId)
		}
	})
	let uploadDir = ''
	if (process.env.NODE_ENV === 'development') {
		uploadDir = './uploads'
	} else {
		uploadDir = path.join(__dirname, '/uploads');
	}
	const filePathFull = uploadDir + '/' + deletedPhoto.urlFull.split('/')[2];
	const filePathMin = uploadDir + '/' + deletedPhoto.urlMin.split('/')[2];
	if (!fs.existsSync(filePathFull) || !fs.existsSync(filePathMin)) {
		return {status: 500}
	}
	fs.rmSync(filePathFull)
	fs.rmSync(filePathMin)

	return deletedPhoto
})