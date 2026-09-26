
// ==========================================
// LOAD ENVIRONMENT VARIABLES
// ==========================================


const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);


require("dotenv").config();


// ==========================================
// IMPORTS
// ==========================================

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// ==========================================
// ENVIRONMENT VARIABLE CHECK
// ==========================================

console.log("=================================");
console.log("ENVIRONMENT CHECK");
console.log("=================================");

console.log(
    "MongoDB URL exists:",
    !!process.env.MONGO_URL
);

console.log(
    "Mapbox Token exists:",
    !!process.env.MAP_TOKEN
);

console.log(
    "Cloudinary Cloud Name exists:",
    !!process.env.CLOUDINARY_CLOUD_NAME
);

console.log(
    "Cloudinary API Key exists:",
    !!process.env.CLOUDINARY_KEY
);

console.log(
    "Cloudinary API Secret exists:",
    !!process.env.CLOUDINARY_SECRET
);

console.log(
    "Session Secret exists:",
    !!process.env.SESSION_SECRET
);

console.log("=================================");


// ==========================================
// DATABASE CONNECTION
// ==========================================

const MONGO_URL = process.env.MONGO_URL;


async function main() {

    await mongoose.connect(MONGO_URL);

}


main()
    .then(() => {

        console.log("Connected to MongoDB");

    })
    .catch((err) => {

        console.log("MongoDB connection error:");
        console.log(err);

    });


// ==========================================
// APP CONFIGURATION
// ==========================================

app.engine(
    "ejs",
    ejsMate
);


app.set(
    "view engine",
    "ejs"
);


app.set(
    "views",
    path.join(__dirname, "views")
);


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
    express.urlencoded({
        extended: true
    })
);


app.use(
    express.json()
);


app.use(
    methodOverride("_method")
);


// ==========================================
// SERVE PUBLIC FOLDER
// ==========================================

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// ==========================================
// SESSION
// ==========================================

const sessionOptions = {

    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: true,

    cookie: {

        httpOnly: true,

        expires:
            Date.now() +
            7 * 24 * 60 * 60 * 1000,

        maxAge:
            7 * 24 * 60 * 60 * 1000

    }

};


app.use(
    session(sessionOptions)
);


// ==========================================
// FLASH
// ==========================================

app.use(
    flash()
);


// ==========================================
// PASSPORT
// ==========================================

app.use(
    passport.initialize()
);


app.use(
    passport.session()
);


passport.use(
    new LocalStrategy(
        User.authenticate()
    )
);


passport.serializeUser(
    User.serializeUser()
);


passport.deserializeUser(
    User.deserializeUser()
);


// ==========================================
// GLOBAL VARIABLES FOR EJS
// ==========================================

app.use(
    (req, res, next) => {

        res.locals.success =
            req.flash("success");

        res.locals.error =
            req.flash("error");

        res.locals.currUser =
            req.user;

        next();

    }
);


// ==========================================
// ROUTES
// ==========================================

app.use(
    "/listings",
    listingRouter
);


app.use(
    "/listings/:id/reviews",
    reviewRouter
);


app.use(
    "/",
    userRouter
);


// ==========================================
// 404 ERROR
// ==========================================

app.use(
    (req, res, next) => {

        const err =
            new Error(
                "Page Not Found"
            );

        err.statusCode = 404;

        next(err);

    }
);


// ==========================================
// ERROR HANDLER
// ==========================================

app.use(
    (err, req, res, next) => {

        let {

            statusCode = 500,

            message =
                "Something went wrong"

        } = err;


        res.status(statusCode);


        res.render(
            "error.ejs",
            {
                err
            }
        );

    }
);


// ==========================================
// SERVER
// ==========================================

const PORT =
    process.env.PORT || 8080;


app.listen(
    PORT,
    () => {

        console.log(
            `Server is listening on port ${PORT}`
        );

    }
);

