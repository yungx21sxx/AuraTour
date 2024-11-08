import fs from 'node:fs'
import { sendStream } from 'h3'
import {fileURLToPath} from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "../../");
export default defineEventHandler(event => {
	let uploadDir = ''
	if (process.env.NODE_ENV === 'development') {
		uploadDir = './uploads'
	} else {
		uploadDir = path.join(__dirname, './uploads');
	}
	try {
		//@ts-ignore
		return sendStream(event, fs.createReadStream(path.join(uploadDir, event.context.params.photo)))
	} catch (e) {
		return null
	}
})