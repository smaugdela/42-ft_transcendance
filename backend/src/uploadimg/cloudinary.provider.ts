import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY } from './constants';

export const cloudinaryProvider = {
    provide: CLOUDINARY,
    useFactory: (): void => {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_APIKEY,
            api_secret: process.env.CLOUDINARY_APISECRET,
        });
    },
};