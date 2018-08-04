const polka = require('polka');
const { json } = require('body-parser');

function one(req, res, next) {
    req.hello = 'world';
    console.log('DATA.length', DATA.length)
    next();
}

function two(req, res, next) {
    req.foo = '...needs better demo 😔';
    next();
}

const DATA = [];
/**
 
GET http://localhost:8765/cherrydb/from/0 HTTP/1.1

POST http://localhost:8765/cherrydb HTTP/1.1
content-type: application/json

{
    "id": "12",
    "timestamp": "12345677891"
}
 */
polka()
    .use(json())
    .use(one, two)
    .get('/cherrydb/:id', (req, res) => {
        console.log(`~> Hello, ${req.hello}`);
        //res.end(`User: ${req.params.id}`);
        const found = DATA.find(x => x.id == req.params.id);
        if (found) {
            res.end(found);
        }
        else
            res.end();
    })
    .get('/cherrydb/from/:ts', (req, res) => {
        console.log('from', req.params.ts);
        const found = DATA.filter(x => x.timestamp > req.params.ts);
        if (found) {
            res.end(JSON.stringify(found));
        }
        else {
            res.end(JSON.stringify([]));
        }
    })
    .post('/cherrydb', (req, res) => {
        try {
            let json = JSON.stringify(req.body); 
            let data = JSON.parse(json);
            DATA.push(data);
            console.log('posted', json);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(json);
        } catch{
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end();
        }
    })
    .listen(8765).then(_ => {
        console.log(`> Running on localhost:8765`);
    });