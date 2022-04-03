require('dotenv').config();

const { response } = require('express');
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// setting the spotify-api goes here:

// Our routes go here:

app.get('/', (request, response) => {
  response.render('home', {});
});

app.get('/home', (request, response) => {
  const name = request.query.name;
  spotifyApi
    .searchArtists(name)
    .then((data) => {
      console.log('The received data from the API: ', data.body);
      response.render('artist-search-result', {
        artists: data.body.artists.items
      });
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    );
});

app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
