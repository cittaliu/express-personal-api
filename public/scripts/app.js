console.log("Sanity Check: JS is working!");

// $(document).ready(function(){
//
// // your code
//
// });

var template;
var $placesList;
var $createPlace;
var allPlaces = [];

$(document).ready(function(){

  $placesList = $('#placeTarget');
  $createPlace = $('#create-place');

  // compile handlebars template
  var source = $('#places-template').html();
  template = Handlebars.compile(source);

  var render = function() {
    // empty existing places from view
    $placesList.empty();

    // pass `allPlaces` into the template function
    var placesHtml = template({
        places: allPlaces
    });

    // append html to the view
    $placesList.append(placesHtml);
};

$.get('/api/places', function(response) {
    console.log(response);

    // set `allPlaces` to data from API
    allPlaces = response;
    console.log(allPlaces);

    // render all places to view
    render();
});

  $createPlace.on('submit', function (event) {
    event.preventDefault();

    // serialze form data
    var newPlace = $(this).serialize();

    // POST request to create new place
    $.post('/api/places', newPlace, function (data) {
      console.log(data);

      // add new place to `allPlaces`
      allPlaces.push(data);

      // render all places to view
      render();
    });
    // reset the form
    $createPlace[0].reset();
    $createPlace.find('input').first().focus();
  });

  $placesList

      // for update: submit event on `.update-book` form
      .on('submit', '.update-place', function (event) {
        event.preventDefault();
        // find the todo's id (stored in HTML as `data-id`)
        var placeId = $(this).closest('.place').attr('data-id');

        // find the todo to update by its id
        var placeToUpdate = allPlaces.filter(function (ele) {
          return ele._id == placeId;
        })[0];

        // serialze form data
        var updatedPlace = $(this).serialize();

        // PUT request to update todo
        $.ajax({
          method: 'PUT',
          url: '/api/places/'+placeId,
          data: updatedPlace,
          success: function (response) {
            allPlaces.splice(allPlaces.indexOf(placeToUpdate), 1, response);
            render();
          }
        });
      })

      // for delete: click event on `.delete-place` button
      .on('click', '.delete-place', function (event) {
        event.preventDefault();
        // find the todo's id (stored in HTML as `data-id`)
        var placeId = $(this).closest('.place').attr('data-id');

        // find the todo to delete by its id
        var placeToDelete = allPlaces.find(function (ele) {
          return ele._id == placeId;
        })[0];

        // DELETE request to delete todo
        $.ajax({
          type: 'DELETE',
          url: '/api/places/' + placeId,
          success: function(json) {
            // remove deleted todo from all todos
            allPlaces.splice(allPlaces.indexOf(placeToDelete), 1);

            // render all todos to view
            render();
          }
        });
      });

  });

// helper function to render all posts to view
// note: we empty and re-render the collection each time our post data changes
// function render () {
//   // empty existing posts from view
//   $placesList.empty();
//
//   // pass `allBooks` into the template function
//   var placesHtml = template({ places: allPlaces });
//
//   // append html to the view
//   $placesList.append(placesHtml);
// }
//
// function handleSuccess(json) {
//   allPlaces = json;
//   render();
// }
//
// function handleError(e) {
//   console.log('uh oh');
//   $('#placeTarget').text('Failed to load books, is the server working?');
// }
//
// function newPlaceSuccess(json) {
//   $('#newPlaceForm input').val('');
//   allPlaces.push(json);
//   render();
// }
//
// function newPlaceError() {
//   console.log('newplace error!');
// }
//
// function deletePlaceSuccess(json) {
//   var place = json;
//   console.log(json);
//   var placeId = place._id;
//   console.log('delete place', placeId);
//   // find the book with the correct ID and remove it from our allBooks array
//   for(var index = 0; index < allPlaces.length; index++) {
//     if(allPlaces[index]._id === placeId) {
//       allPlaces.splice(index, 1);
//       break;  // we found our book - no reason to keep searching (this is why we didn't use forEach)
//     }
//   }
//   render();
// }
//
// function deletePlaceError() {
//   console.log('deleteplace error!');
// }

// function newCharacterSuccess(json) {
//   var book = json;
//   var bookId = book._id;
//   // find the book with the correct ID and update it
//   for(var index = 0; index < allBooks.length; index++) {
//     if(allBooks[index]._id === bookId) {
//       allBooks[index] = book;
//       break;  // we found our book - no reason to keep searching (this is why we didn't use forEach)
//     }
//   }
//   render();
// }

// function newCharacterError() {
//   console.log('adding new character error!');
// }
