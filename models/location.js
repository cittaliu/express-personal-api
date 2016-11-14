var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var LocationSchema = new Schema({
    name: String,
    lat: Number,
    lon: Number
});

var Location = mongoose.model('Location', LocationSchema);
module.exports = Location;
