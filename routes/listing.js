
// ==========================================
// IMPORTS
// ==========================================

const express = require("express");

const router = express.Router();

const wrapAsync =
    require("../utils/wrapAsync.js");

const {
    isLoggedIn,
    isOwner
} = require("../middleware.js");

const listingController =
    require("../controllers/listings.js");

const upload =
    require("../middleware/upload.js");


// ==========================================
// ALL LISTINGS
// ==========================================

router.get(
    "/",
    wrapAsync(listingController.index)
);


// ==========================================
// NEW LISTING FORM
// ==========================================

router.get(
    "/new",
    isLoggedIn,
    listingController.renderNewForm
);


// ==========================================
// CREATE LISTING
// ==========================================

router.post(
    "/",
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
);


// ==========================================
// SHOW LISTING
// ==========================================

router.get(
    "/:id",
    wrapAsync(listingController.showListing)
);


// ==========================================
// EDIT LISTING FORM
// ==========================================

router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);


// ==========================================
// UPDATE LISTING
// ==========================================

router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    wrapAsync(listingController.updateListing)
);


// ==========================================
// DELETE LISTING
// ==========================================

router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
);


// ==========================================
// EXPORT
// ==========================================

module.exports = router;

