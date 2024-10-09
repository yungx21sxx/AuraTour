import {prisma} from "~/server/service/prisma.service";
import path from "path";
import fs from "fs";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "../../");

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, 'id');

	const listing = await prisma.listing.findUnique({
		where: {id: parseInt(<string>id)},
		include: {
			photos: true
		}
	})

	let uploadDir = ''
	if (process.env.NODE_ENV === 'development') {
		uploadDir = './uploads'
	} else {
		uploadDir = path.join(__dirname, './uploads');
	}

	if (!listing) return null;

	for (const photo of listing.photos) {
		const filePathFull = uploadDir + '/' + photo.urlFull.split('/')[2];
		const filePathMin = uploadDir + '/' + photo.urlMin.split('/')[2];
		if (!fs.existsSync(filePathFull) || !fs.existsSync(filePathMin)) {
			return {status: 500}
		}
		fs.rmSync(filePathFull)
		fs.rmSync(filePathMin)
	}

	return prisma.listing.delete({
		where: {
			id: parseInt(id as string)
		}
	})
})