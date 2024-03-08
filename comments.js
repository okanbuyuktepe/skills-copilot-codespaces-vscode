// Create web server
var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var comments = require('./comments.json');

var server = http.createServer(function (req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var path = url_parts.pathname;
    console.log(path);
    console.log(query);

    if (path == '/getComments') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(comments));
    }

    if (path == '/addComment') {
        var data = '';
        req.on('data', function(chunk) {
            data += chunk;
        });
        req.on('end', function() {
            var comment = qs.parse(data);
            comments.push(comment);
            fs.writeFile('./comments.json', JSON.stringify(comments), 'utf-8', function(err) {
                if (err) throw err;
                console.log('Comment added!');
            });
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(comments));
        });
    }

    if (path == '/deleteComment') {
        var data = '';
        req.on('data', function(chunk) {
            data += chunk;
        });
        req.on('end', function() {
            var comment = qs.parse(data);
            var index = comments.indexOf(comment);
            comments.splice(index, 1);
            fs.writeFile('./comments.json', JSON.stringify(comments), 'utf-8', function(err) {
                if (err) throw err;
                console.log('Comment deleted!');
            });
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(comments));
        });
    }

    if (path == '/updateComment') {
        var data = '';
        req.on('data', function(chunk) {
            data += chunk;
        });
        req.on('end', function() {
            var comment = qs.parse(data);
            var index = comments.indexOf(comment);
            comments.splice(index, 1, comment);
            fs.writeFile('./comments.json', JSON.stringify(comments), 'utf-8', function(err) {
                if (err) throw err;
                console.log('Comment updated!');
            });
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(comments));
        });
    }
});