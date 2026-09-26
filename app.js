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
// IMPORT PACKAGES
// ==========================================

const express = require("express");
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
// EXPRESS APP
// ==========================================

const app = express();


// ==========================================
// CHECK ENVIRONMENT VARIABLES
// ==========================================

console.log("=================================");
console.log("ENVIRONMENT VARIABLE CHECK");
console.log("=================================");

console.log(
    "MONGO_URL exists:",
    !!process.env.MONGO_URL
);

console.log(
    "MAP_TOKEN exists:",
    !!process.env.MAP_TOKEN
);

console.log(
    "CLOUDINARY_CLOUD_NAME exists:",
    !!process.env.CLOUDINARY_CLOUD_NAME
);

console.log(
    "CLOUDINARY_KEY exists:",
    !!process.env.CLOUDINARY_KEY
);

console.log(
    "CLOUDINARY_SECRET exists:",
    !!process.env.CLOUDINARY_SECRET
);

console.log(
    "SESSION_SECRET exists:",
    !!process.env.SESSION_SECRET
);

console.log("=================================");


// ==========================================
// MONGODB CONNECTION
// ==========================================

const MONGO_URL = process.env.MONGO_URL;

async function main() {

    try {

        await mongoose.connect(MONGO_URL);

        console.log("=================================");
        console.log("Connected to MongoDB");
        console.log("=================================");

    } catch (err) {

        console.log("=================================");
        console.log("MongoDB connection error:");
        console.log(err);
        console.log("=================================");

    }

}

main();


// ==========================================
// EJS CONFIGURATION
// ==========================================

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);


// ==========================================
// MIDDLEWARE
// ==========================================

// Parse URL encoded data
app.use(
    express.urlencoded({
        extended: true
    })
);


// Parse JSON
app.use(
    express.json()
);


// Method Override
app.use(
    methodOverride("_method")
);


// Static Files
app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// ==========================================
// SESSION CONFIGURATION
// ==========================================

const sessionOptions = {

    secret:
        process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: true,

    cookie: {

        httpOnly: true,

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

app.use(flash());


// ==========================================
// PASSPORT CONFIGURATION
// ==========================================

app.use(passport.initialize());

app.use(passport.session());


// Passport Local Strategy

passport.use(
    new LocalStrategy(
        User.authenticate()
    )
);


// Serialize User

passport.serializeUser(
    User.serializeUser()
);


// Deserialize User

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
// HOME ROUTE
// ==========================================

app.get(
    "/",
    (req, res) => {

        res.redirect("/listings");

    }
);


// ==========================================
// LISTING ROUTES
// ==========================================

app.use(
    "/listings",
    listingRouter
);


// ==========================================
// REVIEW ROUTES
// ==========================================

app.use(
    "/listings/:id/reviews",
    reviewRouter
);


// ==========================================
// USER / AUTH ROUTES
// ==========================================

app.use(
    "/",
    userRouter
);


// ==========================================
// 404 ROUTE
// ==========================================

app.use(
    (req, res, next) => {

        const err =
            new Error(
                "Page Not Found"
            );

        err.status = 404;

        next(err);

    }
);


// ==========================================
// ERROR HANDLING MIDDLEWARE
// ==========================================

app.use(
    (err, req, res, next) => {

        const {
            statusCode = 500,
            message = "Something went wrong"
        } = err;

        res.status(statusCode);

        res.render(
            "error.ejs",
            {
                message
            }
        );

    }
);


// ==========================================
// SERVER
// ==========================================

// Render provides PORT through environment variable.
// Local development will use 8080.

const PORT =
    process.env.PORT || 8080;


app.listen(
    PORT,
    () => {

        console.log("=================================");
        console.log(
            `Server is listening on port ${PORT}`
        );
        console.log("=================================");

    }
);