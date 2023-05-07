const fs = require('fs');
const http = require('http');
const url = require('url');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
let {PythonShell} = require('python-shell');
var agvNormalState=true;
var agvErrorscreenTrigger=true;

app.use(express.static(__dirname + '/templates'));

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

app.post('/fixed', (req, res) => {
    PythonShell.run('test.py', null).then(messages=>{
        console.log('finished');
      });

    if(!agvNormalState) {
        agvNormalState = true;
    }
    
    res.redirect('/main');
});

app.post('/agvfixed', (req, res) => {
    PythonShell.run('test.py', null).then(messages=>{
        console.log('finished');
      });

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
    console.log(agvNormalState);
    if(agvNormalState) {
        agvNormalState = false;
        res.redirect('/main');
    } else {
        res.redirect('/main');
    }
});

app.post('/agvToEror', (req, res) => {
    console.log(agvNormalState);
    if(agvNormalState) {
        agvNormalState = false;
        res.redirect('/agverrorscreen');
    } else {
        res.redirect('/agvstartscreen');
    }
});

app.get('*', (req, res) => {
    if (req.url != '/favicon.ico') {
        const pathName = url.parse(req.url, true).pathname;
        const id = url.parse(req.url, true).query.id;

        // PRODUCT OVERVIEW
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
        // LAPTOP DETAILS
        else if (pathName === '/agvstartscreen') {
            res.writeHead(200, {'Content-type': 'text/html'});

            fs.readFile(`${__dirname}/templates/agvstartscreen.html`, 'utf-8', (err, data) => {
                res.end(data);
            });
        }

        else if (pathName === '/agverrorscreen') {
            res.writeHead(200, {'Content-type': 'text/html'});

            fs.readFile(`${__dirname}/templates/agverrorscreen.html`, 'utf-8', (err, data) => {
                if(!agvNormalState) {
                    data = data.replace(/{%IMG%}/g, laptopData[1].image);
                } else {
                    data = data.replace(/{%IMG%}/g, laptopData[0].image);
                }
                res.end(data);
            });
        }

        else if (pathName === '/whterrormanage') {
            res.writeHead(200, {'Content-type': 'text/html'});

            fs.readFile(`${__dirname}/templates/whterrormanage.html`, 'utf-8', (err, data) => {
                res.end(data);
            });
        }

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

function replaceTemplate(originalHtml, laptop) {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMG%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;
}