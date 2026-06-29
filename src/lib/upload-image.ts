import { v2 as cloudinary } from 'cloudinary';

export function hasCloudinaryConfig() {
    return Boolean(
        process.env.CLOUDINARY_URL ||
        (process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET)
    );
}

export async function uploadImageDataUrl(dataUrl: string) {
    if (!hasCloudinaryConfig()) {
        return dataUrl;
    }

    const result = await cloudinary.uploader.upload(dataUrl, {
        folder: 'hemophilia',
        resource_type: 'image',
        transformation: [
            { width: 1600, height: 1600, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' },
        ],
    });

    return result.secure_url;
}

export async function fileToImageUrl(file: File) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';

    return uploadImageDataUrl(`data:${mimeType};base64,${base64}`);
}
