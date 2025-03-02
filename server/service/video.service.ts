import {fileURLToPath} from "url";
import * as uuid from "uuid";
import {MultiPartData} from "h3";
import path, { join } from "path";
import { writeFile, unlink } from "fs/promises";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import {prisma} from "~/server/service/prisma.service";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "../../");

class VideoService {
    createFileURL(fileNameOriginal: string) {
        const staticUrl = '/uploads/video/';
        const videoHash = uuid.v4();
        const fileNameCompressed = videoHash + '.mp4'

        let uploadDir = ''

        if (process.env.NODE_ENV === 'development') {
            uploadDir = './videos'
        } else {
            uploadDir = path.join(__dirname, '/videos');
        }

        return {
            filePathOriginal: uploadDir + '/' + fileNameOriginal,
            filePathCompressed: uploadDir + '/' + fileNameCompressed,
            fileUrl: staticUrl + fileNameCompressed,
            uploadDir
        }
    }

    getVideoDuration(filePath: string): Promise<number> {
        return new Promise((resolve, reject) => {
            ffmpeg
                .ffprobe( filePath, (err, metadata) => {
                    if (err) {
                        return reject(err);
                    }
                    const duration = metadata.format.duration; // Длительность в секундах

                    if (!duration) reject();
                    else resolve(duration);
                });
        });
    }

    formatTime(seconds: number): string {
        if (seconds < 0) throw new Error("Время не может быть отрицательным");

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        const minutePart = minutes > 0 ? `${minutes} ${this.getPluralForm(minutes, ['минута', 'минуты', 'минут'])}` : '';
        const secondPart = `${remainingSeconds} ${this.getPluralForm(Math.round(remainingSeconds), ['секунда', 'секунды', 'секунд'])}`;

        return [minutePart, secondPart].filter(Boolean).join(' ');
    }

    getPluralForm(number: number, forms: string[]) {
        const absNumber = Math.abs(number);
        if (absNumber % 10 === 1 && absNumber % 100 !== 11) return forms[0];
        if ([2, 3, 4].includes(absNumber % 10) && ![12, 13, 14].includes(absNumber % 100)) return forms[1];
        return forms[2];
    }

    async writeVideo(file: File, title: string, listingId: number) {
        const { filePathCompressed, fileUrl, filePathOriginal, uploadDir } = this.createFileURL(file.name);

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, '0777');
        }

        try {
            // console.time("01: Write original video file");

            const videoBuffer = await file.arrayBuffer();
            await writeFile(filePathOriginal, Buffer.from(videoBuffer));

            // console.timeEnd("01: Write original video file");

            // console.time("02: Get video duration");

            const videoDuration = await this.getVideoDuration(filePathOriginal);
            const formatedDuration = this.formatTime(Math.round(videoDuration));

            // console.timeEnd("02: Get video duration");

            const videoCodec = "libx264";
            const audioCodec = "aac";
            const videoBitrate = "4000k";

            // console.time("03: Compress video with ffmpeg");

            await new Promise((resolve, reject) => {
                ffmpeg()
                    .input(filePathOriginal)
                    .videoFilters(
                        "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2"
                    )
                    .videoCodec(videoCodec)
                    .audioCodec(audioCodec)
                    .outputOptions([
                        "-preset", "ultrafast",
                        "-b:v", videoBitrate,
                        "-c:a", "aac",  // Явное указание кодека
                        "-b:a", "128k", // Битрейт аудио
                        "-crf", "28",
                        "-movflags", "faststart",
                        "-pix_fmt", "yuv420p",
                    ])
                    .format("mp4")
                    .output(filePathCompressed)
                    .on("end", resolve)
                    .on("error", reject)
                    .run();
            });

            // console.timeEnd("03: Compress video with ffmpeg");

            // console.time("04: Delete original file");

            unlink(filePathOriginal);

            // console.timeEnd("04: Delete original file");

            // console.time("05: Save video metadata to database");

            const createdVideo = await prisma.video.create({
                data: {
                    listingId,
                    title,
                    url: fileUrl,
                    duration: Math.round(videoDuration),
                    formatedDuration: formatedDuration
                }
            });

            // console.timeEnd("05: Save video metadata to database");

            // console.log(createdVideo);

            return {
                title,
                url: fileUrl,
                formatedDuration: createdVideo.formatedDuration,
                videoId: createdVideo.id
            };
        } catch (e: any) {
            console.log(e);
            throw new Error(e);
        }
    }
}

export default new VideoService();