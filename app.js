var http = require('http');

// first argument is subreddit
var subReddit = process.argv[2] || "showerthoughts";
// second argument is limit
var limit = process.argv[3] || 5;

// request data from url
var request = http.get('http://www.reddit.com/r/' + subReddit + '/hot.json?limit=' + limit, function(response) {
  var responseBody = "";

  // Concatenate data chunks to responseBody
  response.on('data', function(dataChunk) {
    responseBody += dataChunk;
  });

  // on request end
  response.on('end', function() {
    if(response.statusCode == 200) {
      try {
        // parse data
        var listing = JSON.parse(responseBody);

        // get array of listings
        var arrayListings = listing.data.children;
        var counter = 0;

        // Iterate over arrays outputting the title
        arrayListings.forEach(function(listing) {
          counter++;
          console.log(counter + ": " + listing.data.title);
        });

      } catch(error) {
        // Print parse error
        console.error("Parse error: " + error.message);
      }

    } else {
      // print status code error message
      console.error('There was an error fetching the listings (' + http.STATUS_CODES[response.statusCode] + ')');
    }

  });

});
