import { cloudinary } from "./cloudinary.js";
import { createReadStream } from "streamifier";

export default function cloudinaryUpload(fileBuffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "image-upload-MusicMood" }, // Options object - allows us to specify the folder to store it on cloudinary
      (err, result) => {
        if (result) resolve(result);
        else reject(err);
      }
    );
    createReadStream(fileBuffer).pipe(stream);
  });
}
