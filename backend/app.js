const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger.json");
require("dotenv").config();

// creating an instance of Express
const app = express();
const options = require("./knexfile.js");
// initialising Knex with configuration
const knex = require("knex")(options);
// importing CORS middleware
const cors = require("cors");

const admin = require("./routes/me");
const index = require("./routes/index");
const profile = require("./routes/profile");
const auth = require("./routes/auth");

// Middleware setup
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies
app.use(cookieParser()); // Parse cookies
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// attaching Knex instance to every request
app.use((req, res, next) => {
    req.db = knex;
    next();
});

// customing tokens for logging request and response headers
logger.token("req", (req) => JSON.stringify(req.headers));
logger.token("res", (req, res) => JSON.stringify(res.getHeaders()));

app.use(logger("dev")); // Logging middleware
app.set("views", path.join(__dirname, "views")); // Set view directory
app.set("view engine", "jade"); // Set view engine

// Endpoint to log the database version
app.get("/knex", (req, res) => {
    req.db
        .raw("SELECT VERSION()")
        .then((version) => version[0][0])
        .catch((err) => {
            console.error(err);
            throw err;
        });
    res.send("Version Logged successfully");
});

// Route handlers
app.use("/", index);
app.use("/", profile);
app.use("/", admin);
app.use("/", auth);

// Swagger UI setup
//reference: https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/
app.use("/", swaggerUi.serve);
app.get("/", swaggerUi.setup(swaggerDoc, {
        swaggerOptions: { defaultModelsExpandDepth: -1 }, // Hide schema section
    })
);

// 404 handler
app.use((req, res) => {
    res.status(404).send("Unable to find the requested resource!");
});

// Error handler
app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
