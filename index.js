'use strict';

var express = require('express');
var app = express();
var fs = require('fs');
var request = require('request');
var merge = require('merge');

require('dotenv').config();

var apiKey = process.env.API_KEY;
var config = JSON.parse(fs.readFileSync('config.json'));
var lang = JSON.parse(fs.readFileSync('lang.json'));
var genres = JSON.parse(fs.readFileSync('genres.json'));

app.use(express.static('view'));

app.get('/lang', function(req, res) {
    res.json(lang);
});

app.get('/genres', function(req, res) {
    res.json(genres);
});

app.get('/random-movie', function(req, res) {
    request.get({
        url: 'https://api.themoviedb.org/3/discover/movie',
        qs: merge(req.query, {api_key: apiKey})
    }, function(error, response, body) {
        body = JSON.parse(body).results;

        // pick a random movie from the array of results
        var len = body.length;
        var i = Math.floor(Math.random() * len);
        var movie = body[i];

        // build full url to movie poster
        movie.poster_path = config.images.base_url + config.images.poster_sizes[6] + movie.poster_path;

        // convert ISO 639-1 code to language name
        movie.original_language = lang[movie.original_language].name;

        // convert ISO 639-1 code to genre name
        var ids = movie.genre_ids;
        movie.genre_ids = '';
        for (var i = 0; i < ids.length; i++) {
            for (var j = 0; j < genres.length; j++) {
                if (ids[i] === genres[j].id) {
                    movie.genre_ids += genres[j].name + ', ';
                }
            }
        }
        movie.genre_ids = movie.genre_ids.slice(0, -2);

        res.json(movie);
    });
});

app.listen(process.env.PORT || 3000, function() {
    console.log('server started on port ' + this.address().port);
});
