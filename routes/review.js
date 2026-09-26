const express = require("express");

const router = express.Router({
    mergeParams: true
});

const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");

const Review = require("../models/review.js");

const {
    isLoggedIn,
    isReviewAuthor
} = require("../middleware.js");


// ==========================================
// CREATE REVIEW
// ==========================================

router.post(
    "/",
    isLoggedIn,
    wrapAsync(async (req, res) => {

        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {

            req.flash(
                "error",
                "Listing not found!"
            );

            return res.redirect("/listings");
        }

        const review =
            new Review(req.body.review);

        // Store logged-in user as author
        review.author = req.user._id;

        await review.save();

        listing.reviews.push(review._id);

        await listing.save();

        req.flash(
            "success",
            "Review added successfully!"
        );

        res.redirect(
            `/listings/${id}`
        );

    })
);


// ==========================================
// EDIT REVIEW FORM
// ==========================================

router.get(
    "/:reviewId/edit",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(async (req, res) => {

        const { id, reviewId } = req.params;

        const review =
            await Review.findById(reviewId);

        res.render(
            "reviews/edit.ejs",
            {
                review,
                listingId: id
            }
        );

    })
);


// ==========================================
// UPDATE REVIEW
// ==========================================

router.put(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(async (req, res) => {

        const { id, reviewId } = req.params;

        await Review.findByIdAndUpdate(
            reviewId,
            req.body.review,
            {
                runValidators: true
            }
        );

        req.flash(
            "success",
            "Review updated successfully!"
        );

        res.redirect(
            `/listings/${id}`
        );

    })
);


// ==========================================
// DELETE REVIEW
// ==========================================

router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(async (req, res) => {

        const { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(
            id,
            {
                $pull: {
                    reviews: reviewId
                }
            }
        );

        await Review.findByIdAndDelete(
            reviewId
        );

        req.flash(
            "success",
            "Review deleted successfully!"
        );

        res.redirect(
            `/listings/${id}`
        );

    })
);


module.exports = router;