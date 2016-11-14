// This file allows us to seed our application with data
// simply run: `node seed.js` from the root of this project folder.

var db = require('./models');

var profile = {
    name: 'Diane LIU',
    githubLink: "https://github.com/cittaliu",
    githubProfileImage: "public/image/profile",
    linkedinLink: "https://www.linkedin.com/in/diane-liu-62017260",
    currentCity: "San Francisco",
};


var place_list = [{
    city: "Lanzhou",
    description: "My Hometown",
    state: "GANSU",
    country: "CHINA",
    image: "https://thewelshhorizon.files.wordpress.com/2015/04/lanzhou.jpg"
}, {
    city: "Shanghai",
    description: "4-year College Life",
    state: "SHANGHAI",
    country: "CHINA",
    image: "http://www.103likefm.com/wp-content/uploads/2016/09/shanghai-1.jpg"
}, {
    city: "Boston",
    description: "First stop in US",
    state: "MA",
    country: "United States",
    image: "http://www.hercampus.com/sites/default/files/2014/09/29/pickard.bostonfallcoverpic.jpg"
}, {
    city: "New York City",
    description: "The Metropolitan Museum of Art is awesome!",
    state: "NYC",
    country: "United States",
    image: "http://s.wsj.net/public/resources/MWimages/MW-BQ022_new_yo_MG_20131127151634.jpg"
}, {
    city: "San Francisco",
    description: "Current City",
    state: "CA",
    country: "United States",
    image: "http://hoteldiva.com/sites/default/files/HD-home-2.jpg"
}];

var location_list = [{
    name: "Lanzhou",
    lat: 36.061089,
    lon: 103.834304
}, {
    name: "Shanghai",
    lat: 31.230416,
    lon: 121.473701
}, {
    name: "Boston",
    lat: 42.360082,
    lon: -71.058880
}, {
    name: "New York City",
    lat: 40.712784,
    lon: -74.005941
}, {
    name: "San Francisco",
    lat: 37.774929,
    lon: -122.419416
}];

db.Profile.remove({}, function(err, suc) {
    if (err) {
        console.error(err);
    }
    db.Profile.create(profile, function(err, suc) {
        if (err) {
            console.log(err);
        }
        console.log('recreated my profile');
    });
});

db.Location.remove({}, function(err, locations) {
    console.log('removed all locations');
    db.Location.create(location_list, function(err, locations) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('recreated all locations');
        console.log("created", locations.length, "locations");


        db.Place.remove({}, function(err, places) {
            console.log('removed all places');
            place_list.forEach(function(placeData) {
                var place = new db.Place({
                    city: placeData.city,
                    description: placeData.description,
                    state: placeData.state,
                    country: placeData.country,
                    image: placeData.image
                });
                db.Location.findOne({
                    name: placeData.city
                }, function(err, foundLocation) {
                    console.log('found location ' + foundLocation.name);
                    if (err) {
                        console.log(err);
                        return;
                    }
                    place.location = foundLocation;
                    place.save(function(err, savedPlace) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log('saved ' + savedPlace);
                    });
                });
            });
        });
    });
});
