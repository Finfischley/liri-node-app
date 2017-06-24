//initialize twitter client
var Twitter = require("twitter");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var request = require('request');

//Twitter
var client = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});
// console.log(client);
function getTweets() {
	
	var params = {screen_name: 'finfishley', count: 20};

	client.get("statuses/user_timeline", params, function(err, tweets) {
		if(!err) {
		 	for( i = 0; i < tweets.length; i++) {
				console.log(tweets[i].text);
			}
		}else{
			console.log("error");
		}
	})
}

// SPOTIFY
var spotify = new Spotify({
  id: keys.spotifykeys.client_ID,
  secret: keys.spotifykeys.client_secret
});

function searchSpotify(songName) {
	if (songName === undefined) {
		spotify.search ({ type: 'track', query: 'The Sign'}, function(err, data) {
	  		if (err) {
	    		console.log('Error occurred: ' + err);
	    		return;
	  		}
		  		console.log(data.tracks.items[4].artists[0].name);
		  		console.log(data.tracks.items[4].name);
		  		console.log(data.tracks.items[4].preview_url);
		  		console.log(data.tracks.items[4].album.name);
		})
			}else{
	 
				spotify.search ({ type: 'track', query: songName, limit: 1}, function(err, data) {
			  		if (err) {
			    		console.log('Error occurred: ' + err);
			    		return;
			  		}else{
			 			console.log(data.tracks.items[0].artists[0].name);
				  		console.log(data.tracks.items[0].name);
				  		console.log(data.tracks.items[0].preview_url);
				  		console.log(data.tracks.items[0].album.name);
			 		}
		 		})
			}
};
	
// OMDB
var movieArgs = process.argv;
var movieName = "";

	for (var i = 3; i < movieArgs.length; i++) {
		if (i > 3 && i < movieArgs.length) {
			movieName = movieName + "+" + movieArgs[i];
		}else{
			movieName += movieArgs[i];
		}
	}
var searchMovie = function() {		
	// We then run the request module on a URL with a JSON
	request("http://www.omdbapi.com/?t=" + movieName + "&tomatoes=true&y=&plot=short&apikey=40e9cece", function(error, response, body) {
		// If there were no errors and the response code was 200 (i.e. the request was successful)...
  		if (!error && response.statusCode === 200) {
			// console.log results
		    console.log("Title: " + JSON.parse(body).Title);
		    console.log("Year of Release: " + JSON.parse(body).Year);
		    console.log("Rating: " + JSON.parse(body).imdbRating);
		    console.log("Country of Origin: " + JSON.parse(body).Country);
		    console.log("Language: " + JSON.parse(body).Language);
		    console.log("Plot: " + JSON.parse(body).Plot);
		    console.log("Actors: " + JSON.parse(body).Actors);
		    console.log("Rotten Tomatoes URL:" + JSON.parse(body).tomatoURL);
		}
	});
}

// REQUEST
var fs = require("fs");
// initiate function from command do-what-it-says
function readFile() {
	// read file random.txt
	fs.readFile("random.txt", "utf8", function(error, data) {
		//console.log(data);
		var randomCommand = data.split(',')

		if (error) {
			return console.log(error);
		}else if (randomCommand[0] == 'my-tweets') {
			getTweets();	
		}else if (randomCommand[0] == 'spotify-this-song') {
			var songName = randomCommand[1];
			searchSpotify(songName);
		}else if (randomCommand[0] == 'movie-this') {
			var movieName = randomCommand[1];
			searchMovie();
			}
		})	
	}
	
//take in the command line args
var nodeArgs = process.argv[2];

switch(nodeArgs) {
	case "my-tweets":
	getTweets();
	break;

	case "spotify-this-song":
	var songName = process.argv[3];
	searchSpotify(songName);
	break;

	case "movie-this":
	searchMovie();
	break;

	case "do-what-it-says":
	readFile();
	break;
}


