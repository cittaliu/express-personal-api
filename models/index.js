var mongoose = require("mongoose");
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/personal-api");

// module.exports.Campsite = require("./campsite.js.example");
module.exports.Place = require("./place.js");
module.exports.Profile = require("./profile.js");
module.exports.Location = require("./location.js");
