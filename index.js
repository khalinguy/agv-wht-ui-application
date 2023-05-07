const fs = require('fs');
const http = require('http');
const url = require('url');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
let {PythonShell} = require('python-shell');
var agvNormalState=true;

app.use(express.static(__dirname + '/templates'));

app.post('/fixed', (req, res) => {
    PythonShell.run('test.py', null, function(err,results){
        console.log(results);
        console.log('finished');
      });
    res.redirect('/main');
});

app.post('/fixedfromwht', (req, res) => {
    if(!agvNormalState) {
        agvNormalState = true;
    }
    res.redirect('/main');
});

app.post('/agvfixed', (req, res) => {
    if(!agvNormalState) {
        agvNormalState = true;
    }
    res.redirect('/agvstartscreen');
});

app.post('/agvToErorState', (req, res) => {
    if(agvNormalState) {
        agvNormalState = false;
    }
    res.redirect('/agverrorscreen');
});

app.post('/agvToErorFromWHT', (req, res) => {
    if(agvNormalState) {
        agvNormalState = false;
        res.redirect('/main');
    } else {
        res.redirect('/main');
    }
});

app.post('/agvToEror', (req, res) => {
    if(agvNormalState) {
        agvNormalState = false;
        res.redirect('/agverrorscreen');
    } else {
        res.redirect('/agvstartscreen');
    }
});

app.post('/left', (req, res) => {
    PythonShell.run('data/script/left.py', null, function(err,results){
        console.log(results);
        console.log('finished');
      });
    res.redirect('/remotecontrol');
});

app.post('/right', (req, res) => {
    PythonShell.run('data/script/right.py', null, function(err,results){
        console.log(results);
        console.log('finished');
      });
    res.redirect('/remotecontrol');
});

app.post('/forward', (req, res) => {
    PythonShell.run('data/script/forward.py', null, function(err,results){
        console.log(results);
        console.log('finished');
      });
    res.redirect('/remotecontrol');
});

app.post('/backward', (req, res) => {
    PythonShell.run('data/script/backward.py', null, function(err,results){
        console.log(results);
        console.log('finished');
      });
    res.redirect('/remotecontrol');
});

app.get('*', (req, res) => {
    if (req.url != '/favicon.ico') {
        const pathName = url.parse(req.url, true).pathname;
        const id = url.parse(req.url, true).query.id;

        // MAIN MAPVIEW
        if (pathName === '/main' || pathName === '/') {
            res.writeHead(200, {'Content-type': 'text/html'});
            fs.readFile(`${__dirname}/templates/mapview.html`, 'utf-8', (err, data) => {
                if(!agvNormalState) {
                    data = data.replace(/{%MAINIMG%}/g, "mapview-error-body.png");
                } else {
                    data = data.replace(/{%MAINIMG%}/g, "map_new._body.png");
                }
                res.end(data);

            });

        }
        // AGV START SCREEN
        else if (pathName === '/agvstartscreen') {
            res.writeHead(200, {'Content-type': 'text/html'});

            fs.readFile(`${__dirname}/templates/agvstartscreen.html`, 'utf-8', (err, data) => {
                if (!agvNormalState) {
                    data = data.replace(/{%IMG%}/g, "AGV-Red.png");
                    res.render(data);
                } else {
                    data = data.replace(/{%IMG%}/g, "AGV-Green.png");
                }
                res.end(data);
            });
        }

        // AGV INTERACTIVE SCREEN
        else if (pathName === '/agverrorscreen') {
            res.writeHead(200, {'Content-type': 'text/html'});

            fs.readFile(`${__dirname}/templates/agverrorscreen.html`, 'utf-8', (err, data) => {
                if(!agvNormalState) {
                    data = data.replace(/{%IMG%}/g, "AGV-Red.png");
                } else {
                    data = data.replace(/{%IMG%}/g, "AGV-Green.png");
                }
                res.end(data);
            });
        }

        // WHT ERROR MANAGE
        else if (pathName === '/whterrormanage') {
            res.writeHead(200, {'Content-type': 'text/html'});

            fs.readFile(`${__dirname}/templates/whterrormanage.html`, 'utf-8', (err, data) => {
                res.end(data);
            });
        }

        // REMOTE CONTROL
        else if (pathName === '/remotecontrol') {
            res.writeHead(200, {'Content-type': 'text/html'});

            fs.readFile(`${__dirname}/templates/remotecontrol.html`, 'utf-8', (err, data) => {
                res.end(data);
            });
        }

        // IMAGES
        else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
            fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
                res.writeHead(200, {'Content-type': 'image/jpg'});
                res.end(data);
            })
        }

        // URL NOT FOUND
        else {
            res.writeHead(404, {'Content-type': 'text/html'});
            res.end('URL was not found on the server!');
        }
    }
})

app.listen(port);
