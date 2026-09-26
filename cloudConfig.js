const cloudinary = require("cloudinary").v2;

const {
    CloudinaryStorage
} = require("multer-storage-cloudinary");

cloudinary.config({

    cloud_name:
        process.env.CLOUDINARY_CLOUD_NAME,

    api_key:
        process.env.CLOUDINARY_KEY,

    api_secret:
        process.env.CLOUDINARY_SECRET

});


console.log("=================================");
console.log("CLOUDINARY CONFIG CHECK");
console.log("Cloud Name:",
    process.env.CLOUDINARY_CLOUD_NAME
);

console.log(
    "API Key exists:",
    !!process.env.CLOUDINARY_KEY
);

console.log(
    "API Secret exists:",
    !!process.env.CLOUDINARY_SECRET
);

console.log("=================================");


const storage =
    new CloudinaryStorage({

        cloudinary: cloudinary,

        params: {

            folder: "wanderlust_DEV",

            allowed_formats: [
                "jpg",
                "jpeg",
                "png",
                "webp"
            ]

        }

    });


module.exports = {

    cloudinary,

    storage

};