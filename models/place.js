var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  Location = require('./location.js');

var PlaceSchema = new Schema({
    city: String,
    description: String,
    state: String,
    country: String,
    location: {type: Schema.Types.ObjectId, ref: 'Location'},
    image: String
});

var Place = mongoose.model('Place', PlaceSchema);
module.exports = Place;
