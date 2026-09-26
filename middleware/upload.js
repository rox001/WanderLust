const multer = require("multer");

const {
    storage
} = require("../cloudConfig.js");

// ==========================================
// FILE FILTER
// ==========================================

const fileFilter = function (req, file, cb) {

    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ];

    const path = require("path");

    const extension =
        path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(extension)) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            )
        );

    }

};

// ==========================================
// MULTER
// ==========================================

const upload = multer({

    storage: storage,

    fileFilter: fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});

// ==========================================
// EXPORT
// ==========================================

module.exports = upload;