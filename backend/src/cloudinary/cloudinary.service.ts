import { UploadApiResponse, UploadApiErrorResponse, v2 as cloudinary } from "cloudinary";
import * as streamifier from 'streamifier';
// import toStream from "buffer-to-stream";

export class CloudinaryService {
    async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            // 1 KB = 1024 Bytes, 1MB = 1024 KB. 
            // Here we fixed the limit at 5MB of file size.
            if (file.size > 1024 * 1024 * 5) {
                return reject("File too large");
            }
            console.log('I have the file!', file);
            console.log(' file multer name: ', file.originalname);
            
            
            
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "pong_avatars", // upload in folder name
                    public_id: file.originalname, // rename file
                    overwrite: true, // overwrite the image if it already exists
                    resource_type: "auto", // detect the file extension and upload it correctly
                },
                (error, avatar) => {
                    if (avatar) {
                        resolve(avatar);
                    } else {
                        reject(error);
                    }
                }
            );
            console.log(`i'm there!`);
            // BLOQUE A CE MOMENT LA
            const readableStream = streamifier.createReadStream(file.buffer);
            readableStream.pipe(uploadStream);
            console.log('wooooooH');
            
        });
    }
}