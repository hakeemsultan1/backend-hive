import cloudinary from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function uploadToCloudinary(file) {
    try {
        const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        let resp = await cloudinary.uploader.upload(fileBase64, {
            folder: "hive",
            resource_type: "csv",
            public_id: file.originalname.split('.')[0],
            format: "csv",
        });
        if (resp.url) {
            return resp.url;
        }
        return false;
    } catch (error) {
        console.log(error, "err");
        return false;
    }
}