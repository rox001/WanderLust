const Listing = require("../models/listing.js");


// ==========================================
// SHOW ALL LISTINGS + SEARCH
// ==========================================

module.exports.index = async (req, res) => {

    const { search } = req.query;

    let allListings;

    // ==========================================
    // NO SEARCH
    // ==========================================

    if (!search || search.trim() === "") {

        allListings = await Listing.find({});

    }

    // ==========================================
    // SEARCH
    // ==========================================

    else {

        const searchText = search.trim();

        allListings = await Listing.find({

            $or: [

                {
                    title: {
                        $regex: searchText,
                        $options: "i"
                    }
                },

                {
                    location: {
                        $regex: searchText,
                        $options: "i"
                    }
                },

                {
                    country: {
                        $regex: searchText,
                        $options: "i"
                    }
                },

                {
                    category: {
                        $regex: searchText,
                        $options: "i"
                    }
                }

            ]

        });

    }

    // ==========================================
    // SHOW RESULTS
    // ==========================================

    res.render(
        "listings/index.ejs",
        {
            allListings,
            search: search || ""
        }
    );

};


// ==========================================
// RENDER NEW LISTING FORM
// ==========================================

module.exports.renderNewForm = (req, res) => {

    res.render(
        "listings/new.ejs"
    );

};


// ==========================================
// SHOW ONE LISTING
// ==========================================

module.exports.showListing = async (req, res) => {

    const { id } = req.params;

    const listing =
        await Listing.findById(id)
            .populate("owner")
            .populate({
                path: "reviews",
                populate: {
                    path: "author"
                }
            });

    // ==========================================
    // LISTING NOT FOUND
    // ==========================================

    if (!listing) {

        req.flash(
            "error",
            "Listing not found!"
        );

        return res.redirect(
            "/listings"
        );

    }

    // ==========================================
    // SHOW LISTING
    // ==========================================

    res.render(
        "listings/show.ejs",
        {
            listing,
            mapToken: process.env.MAP_TOKEN
        }
    );

};


// ==========================================
// CREATE NEW LISTING
// ==========================================

module.exports.createListing = async (req, res) => {

    console.log("=================================");
    console.log("CREATE LISTING REQUEST");
    console.log("=================================");

    console.log("REQ.BODY:");
    console.log(req.body);

    console.log("REQ.FILE:");
    console.log(req.file);


    // ==========================================
    // CREATE LISTING
    // ==========================================

    const newListing =
        new Listing(
            req.body.listing
        );


    // ==========================================
    // SET OWNER
    // ==========================================

    newListing.owner =
        req.user._id;


    // ==========================================
    // CLOUDINARY IMAGE
    // ==========================================

    if (req.file) {

        newListing.image = {

            filename:
                req.file.filename,

            url:
                req.file.path

        };

        console.log(
            "================================="
        );

        console.log(
            "CLOUDINARY IMAGE INFORMATION"
        );

        console.log(
            "================================="
        );

        console.log(
            "IMAGE FILE NAME / PUBLIC ID:",
            req.file.filename
        );

        console.log(
            "IMAGE URL:",
            req.file.path
        );

        console.log(
            "================================="
        );

    }


    // ==========================================
    // SAVE LISTING
    // ==========================================

    await newListing.save();


    // ==========================================
    // FINAL IMAGE INFORMATION
    // ==========================================

    console.log(
        "================================="
    );

    console.log(
        "FINAL IMAGE SAVED IN MONGODB"
    );

    console.log(
        "================================="
    );

    console.log(
        "Listing ID:",
        newListing._id.toString()
    );


    if (newListing.image) {

        console.log(
            "Image filename/public_id:",
            newListing.image.filename
        );

        console.log(
            "Image URL:",
            newListing.image.url
        );

    }


    console.log(
        "================================="
    );


    req.flash(
        "success",
        "New listing created!"
    );


    res.redirect(
        `/listings/${newListing._id}`
    );

};


// ==========================================
// RENDER EDIT FORM
// ==========================================

module.exports.renderEditForm =
    async (req, res) => {

        const { id } = req.params;

        const listing =
            await Listing.findById(id);


        if (!listing) {

            req.flash(
                "error",
                "Listing not found!"
            );

            return res.redirect(
                "/listings"
            );

        }


        res.render(
            "listings/edit.ejs",
            {
                listing
            }
        );

    };


// ==========================================
// UPDATE LISTING
// ==========================================

module.exports.updateListing =
    async (req, res) => {

        const { id } = req.params;


        // ==========================================
        // UPDATE TEXT DATA
        // ==========================================

        const listing =
            await Listing.findByIdAndUpdate(

                id,

                {
                    ...req.body.listing
                },

                {
                    new: true
                }

            );


        // ==========================================
        // LISTING NOT FOUND
        // ==========================================

        if (!listing) {

            req.flash(
                "error",
                "Listing not found!"
            );

            return res.redirect(
                "/listings"
            );

        }


        // ==========================================
        // UPDATE CLOUDINARY IMAGE
        // ==========================================

        if (req.file) {

            listing.image = {

                filename:
                    req.file.filename,

                url:
                    req.file.path

            };


            await listing.save();


            console.log(
                "================================="
            );

            console.log(
                "UPDATED CLOUDINARY IMAGE"
            );

            console.log(
                "================================="
            );

            console.log(
                "IMAGE FILE NAME / PUBLIC ID:",
                req.file.filename
            );

            console.log(
                "IMAGE URL:",
                req.file.path
            );

            console.log(
                "================================="
            );

        }


        // ==========================================
        // SUCCESS
        // ==========================================

        req.flash(
            "success",
            "Listing updated!"
        );


        res.redirect(
            `/listings/${id}`
        );

    };


// ==========================================
// DELETE LISTING
// ==========================================

module.exports.destroyListing =
    async (req, res) => {

        const { id } = req.params;


        await Listing.findByIdAndDelete(
            id
        );


        req.flash(
            "success",
            "Listing deleted!"
        );


        res.redirect(
            "/listings"
        );

    };