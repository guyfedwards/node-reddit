#! /usr/bin/env node
'use strict'

const http = require('http')
const meow = require('meow')
const inquirer = require('inquirer')
const exec = require('child_process').exec

// first argument is subreddit
const subReddit = process.argv[2] || 'showerthoughts';
// second argument is limit
const limit = process.argv[3] || 5;

const url = 'http://www.reddit.com/r/' + subReddit + '/hot.json?limit=' + limit;

const cli = meow(`
    Usage
    $ reddit

    Options
    --subreddit, -s Choose subreddit. Default showerthoughts
    --limit, -l Limit number of results. Default 10
  `)

// request data from url
const request = http.get(url, function(response) {
  let responseBody = "";

  // Concatenate data chunks to responseBody
  response.on('data', function(dataChunk) {
    responseBody += dataChunk;
  });

  // on request end
  response.on('end', function() {
    if(response.statusCode == 200) {
      try {
        const listing = JSON.parse(responseBody);

        const arrayListings = listing.data.children
        let counter = 0
        let qs = []

        arrayListings.forEach(listing => {
          counter++;
          qs.push({
            name: `${counter}. ${listing.data.title}`,
            value: listing.data.url
          })
        });

        inquirer.prompt({
          type: 'list',
          name: 'Reddit',
          message: 'Latest links',
          choices: qs
        })
        .then(answer => {
          exec(`open ${answer.Reddit}`, (err, stdout, stderr) => {
            if (err) console.log(err)
          })
        })

      } catch(error) {
        console.error("Parse error: " + error.message);
      }

    } else {
      console.error('There was an error fetching the listings (' + http.STATUS_CODES[response.statusCode] + ')');
    }

  });

});
