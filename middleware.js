const Listing = require("./models/listing.js");
const Review = require("./models/review.js");


// ==========================================
// CHECK LOGIN
// ==========================================

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {

        req.flash(
            "error",
            "You must be logged in!"
        );

        return res.redirect("/login");
    }

    next();
};


// ==========================================
// CHECK LISTING OWNER
// ==========================================

module.exports.isOwner = async (req, res, next) => {

    try {

        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {

            req.flash(
                "error",
                "Listing not found!"
            );

            return res.redirect("/listings");
        }

        if (
            !listing.owner ||
            !listing.owner.equals(req.user._id)
        ) {

            req.flash(
                "error",
                "You don't have permission to do that!"
            );

            return res.redirect(
                `/listings/${id}`
            );
        }

        next();

    } catch (err) {

        next(err);

    }
};


// ==========================================
// CHECK REVIEW AUTHOR
// ==========================================

module.exports.isReviewAuthor = async (req, res, next) => {

    try {

        const { reviewId } = req.params;

        const review = await Review.findById(reviewId);

        // Review not found
        if (!review) {

            req.flash(
                "error",
                "Review not found!"
            );

            return res.redirect(
                `/listings/${req.params.id}`
            );
        }

        // Check review author
        if (
            !review.author ||
            !review.author.equals(req.user._id)
        ) {

            req.flash(
                "error",
                "You don't have permission to edit this review!"
            );

            return res.redirect(
                `/listings/${req.params.id}`
            );
        }

        next();

    } catch (err) {

        next(err);

    }
};