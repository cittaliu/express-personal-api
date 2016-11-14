// require express and other modules
var express = require('express'),
    app = express();

// parse incoming urlencoded form data
// and populate the req.body object
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));

// allow cross origin requests (optional)
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/************
 * DATABASE *
 ************/

var db = require('./models');

/**********
 * ROUTES *
 **********/

// Serve static files from the `/public` directory:
// i.e. `/images`, `/scripts`, `/styles`
app.use(express.static('public'));

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', function api_index(req, res) {
    //Document all the api endpoints below
    res.json({
        message: "Welcome to my personal api! Here's what you need to know!",
        documentationUrl: "https://github.com/cittaliu/express-personal-api/blob/master/README.md", // CHANGE ME
        baseUrl: "https://protected-garden-26570.herokuapp.com/",
        endpoints: [{
                method: "GET",
                path: "/api",
                description: "Describes all available endpoints"
            }, {
                method: "GET",
                path: "/api/profile",
                description: "Data about me"
            }, // CHANGE ME
            {
                method: "GET",
                path: "/api/places",
                description: "Places I have visited"
            }, {
                method: "GET",
                path: "/api/places/:id",
                description: "Search for a single city"
            }, {
                method: "POST",
                path: "/api/places",
                description: "Post a new place"
            }, {
                method: "PUT",
                path: "/api/places/:id",
                description: "Update a place"
            }, {
                method: "DELETE",
                path: "/api/places/:id",
                description: "Delete a place with id"
            }
        ]
    });
});

/**********
 * SERVER *
 **********/

app.get('/api/profile', function(req, res) {

    // send my profile as JSON response
    db.Profile.find({}, function(err, profile) {
        if (err) {
            return console.log(err);
        }
        console.log(profile);
        res.json(profile);
    });
});

app.get('/api/places', function(req, res) {
    // send all places as JSON response
    db.Place.find().populate('location')
        .exec(function(err, places) {
            if (err) {
                return console.log("index error: " + err);
            }
            res.json(places);
        });
});

app.get('/api/places/:id', function(req, res) {
    db.Place.findOne({
        _id: req.params.id
    }, function(err, data) {
        res.json(data);
    });
});


//update

// app.put('/api/places/:id', function(req, res) {
//     db.Place.fineOne({
//         _id: req.params.id
//     }, function(err, place) {
//         if (err) {
//             return console.log("Can't update the place!");
//         }
//         // place.city = req.body.city;
//         // place.description = req.body.description;
//         // place.state = req.body.state;
//         // place.country = req.body.country;
//         // place.image = req.body.image;
//         // place.location = req.body.location;
//         place = req.body;
//         place.save(function(err, updatedPlace) {
//             if (err) {
//                 return console.log("save error: " + err);
//             }
//             console.log("saved ", updatedPlace);
//             // send back the book!
//             res.json(updatedPlace);
//         });
//     });
//
// });
// app.put('/api/places/:id', function update(req, res) {
//   db.Place.forEach(function (ele, index) {
//     var data = req.body;
//     if (ele._id === parseInt(req.params.id)) {
//       db.Place.splice(index, 1, {
//         _id: ele._id,
//         city: data.city,
//         state: data.state,
//         country: data.country,
//         description: data.description,
//       });
//       res.json(db.Place[index]);
//     }
//   });
// });

app.post('/api/places/:id', function update(req, res) {
  /* This endpoint will update a single todo with the
   * id specified in the route parameter (:id) and respond
   * with the newly updated todo.
   */
   var cur = parseInt(req.params.id);
   var city = req.body.city;
   var state = req.body.state;
   var country = req.body.country;
   var description = req.body.description;
   var updateId = function(){
     for(var i=0; i< db.Place.length; i++){
       if(db.Place[i]._id===cur){
         db.Place[i].city = city;
         db.Place[i].state = state;
         db.Place[i].country = country;
         db.Place[i].description = description;
         return db.Place[i];
       }
     }
   };
   res.json(updateId());
});
// create new place
app.post('/api/places', function(req, res) {
    // create new place with form data (`req.body`)
    var newPlace = new db.Place({
        city: req.body.city,
        description: req.body.description,
        state: req.body.state,
        country: req.body.country,
        image: req.body.image,
    });
    var location = new db.Location({
        name: req.body.city
    });
    location.save();
    // add this location to the place
    newPlace.location = location;

    // save newPlace to database
    newPlace.save(function(err, place) {
        if (err) {
            return console.log("save error: " + err);
        }
        console.log("saved ", place.city);
        // send back the book!
        res.json(place);

    });
});

app.delete('/api/places/:id', function(req, res) {
    var id = req.params.id;
    db.Place.findOneAndRemove({
        _id: id
    }, function(err, placeToDelete) {
        res.json(placeToDelete);
    });
});




// listen on port 3000
app.listen(process.env.PORT || 3000, function() {
    console.log('Express server is up and running on http://localhost:3000/');
});
