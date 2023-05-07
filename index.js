const fs = require('fs');
const http = require('http');
const url = require('url');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
let {PythonShell} = require('python-shell');
var setNewLaptop=true;

app.use(express.static(__dirname + '/templates'));

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

app.post('/login', (req, res) => {

    PythonShell.run('test.py', null).then(messages=>{
        console.log('finished');
      });

    const click = {clickTime: new Date()};
    console.log(click);
    console.log(setNewLaptop);
    if(!setNewLaptop) {
        setNewLaptop = true;
    } else {
        setNewLaptop = false;
    }
    res.redirect('/products');
});

app.get('*', (req, res) => {
    if (req.url != '/favicon.ico') {
        const pathName = url.parse(req.url, true).pathname;
        const id = url.parse(req.url, true).query.id;

        // PRODUCT OVERVIEW
        if (pathName === '/products' || pathName === '/') {
            res.writeHead(200, {'Content-type': 'text/html'});
            fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
                let overviewOutput = data;
                fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {

                    const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
                    overviewOutput = overviewOutput.replace('{%CARD%}', cardsOutput);
                    res.end(overviewOutput);
                });

            });

        }
        // LAPTOP DETAILS
        else if (pathName === '/laptop') {
            res.writeHead(200, {'Content-type': 'text/html'});

            fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
                const laptop = laptopData[id];
                // const output = replaceTemplate(data, laptop);
                if(!setNewLaptop) {
                    data = data.replace(/{%IMG%}/g, laptopData[1].image);
                } else {
                    data = data.replace(/{%IMG%}/g, laptopData[0].image);
                }
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

// const server = http.createServer((req, res) => {
//     if (req.url != '/favicon.ico') {
//         const pathName = url.parse(req.url, true).pathname;
//         const id = url.parse(req.url, true).query.id;
//
//         // PRODUCT OVERVIEW
//         if (pathName === '/products' || pathName === '/') {
//             res.writeHead(200, {'Content-type': 'text/html'});
//             fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
//                 let overviewOutput = data;
//                 fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
//
//                     const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
//                     overviewOutput = overviewOutput.replace('{%CARD%}', cardsOutput);
//                     res.end(overviewOutput);
//                 });
//
//             });
//
//         }
//         // LAPTOP DETAILS
//         else if (pathName === '/laptop' && id < laptopData.length) {
//             res.writeHead(200, {'Content-type': 'text/html'});
//
//             fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
//                 const laptop = laptopData[id];
//                 const output = replaceTemplate(data, laptop);
//                 res.end(output);
//             });
//         }
//
//         // IMAGES
//         else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
//             fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
//                 res.writeHead(200, {'Content-type': 'image/jpg'});
//                 res.end(data);
//             })
//         }
//
//         // URL NOT FOUND
//         else {
//             res.writeHead(404, {'Content-type': 'text/html'});
//             res.end('URL was not found on the server!');
//         }
//     }
// });
//
// server.listen(1337, '127.0.0.1', () => {
//     console.log('Listening for requests now');
// });

function replaceTemplate(originalHtml, laptop) {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    if (setNewLaptop === true) {
        output = output.replace(/{%DESCRIPTION%}/g, laptop.newdescription);
    } else {
        output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    }
    output = output.replace(/{%IMG%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;
}