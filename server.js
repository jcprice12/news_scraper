// Dependencies
var express = require("express");
var mongoose = require("mongoose");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");

var app = express();
var PORT = process.env.PORT || 8080;
var mongo_connection = process.env.MONGODB_URI || "mongodb://localhost/news_scraper";

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

//use handlebars as the rendering engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
//set handlebars as the view engine
app.set("view engine", "handlebars");

// Hook mongojs configuration to the db variable
// Database configuration with mongoose
mongoose.connect(mongo_connection, {
    useMongoClient: true
});
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("openUri", function() {
    console.log("Mongoose connection successful.");
});

// Import routes and give the server access to them.
var routes = require("./controllers/main_controller.js");
app.use("/", routes);

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
