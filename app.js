require('dotenv').config();

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

// get artist
app.get('/home', (request, response) => {
  const name = request.query.name;
  spotifyApi
    .searchArtists(name)
    .then((data) => {
      console.log('The received data from the API: ', data.body.artists.items);
      response.render('artist-search-result', {
        artists: data.body.artists.items
      });
    })
    .catch((err) =>
      console.log('There was an error while searching artists occurred: ', err)
    );
});

// get artist albums
app.get('/albums/:id', (request, response, next) => {
  const albums = request.params.id;
  spotifyApi
    .getArtistAlbums(albums)
    .then((data) => {
      console.log('The received data from the API: ', data.body.items);
      response.render(
        'albums',
        { albums: data.body.items }
        // pageStyles: [{ style: '/styles/albums.css' }],
      );
    })
    .catch((err) =>
      console.log('The error while searching albums occurred: ', err)
    );
});
// get album track list
app.get('/tracks/:id', (request, response) => {
  const tracks = request.params.id;
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      console.log('The received data from the API: ', data.body.items);
      response.render('albums', {
        albums: data.body.items
      });
    })
    .catch((err) =>
      console.log('The error while searching album tracks occurred: ', err)
    );
});
app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
