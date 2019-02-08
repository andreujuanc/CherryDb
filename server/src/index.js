const polka = require('polka');
const bodyParser = require('body-parser');

function one(req, res, next) {
    req.hello = 'world';
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With,  X-HTTP-Method-Override, Content-Type, Accept");
    if (req.method === 'OPTIONS')
        return res.end();
    //console.log('DATA.length', DATA.length)
    //console.log(DATA)
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
    "timestamp": 12345677891,
    "text": "hello"
}
 */
polka()
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .use(bodyParser.json())
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
        ///console.log('from', req.params.ts);
        const found = DATA.filter(x => x.timestamp > req.params.ts);
        if (found) {
            //res.statusCode = 200 ;
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(found));
        }
        else {
            res.statusCode = 200;
            res.end(JSON.stringify([]));
        }
    })
    .post('/cherrydb', (req, res) => {
        
        try {
            var records = req.body;
            if (!Array.isArray(records))
                records = [records];
            
            for (var i = 0; i < records.length; i++) {
                if (records[i].id) {
                    if (records[i].deleted === true) {
                        console.log('deleting item', records[i]);
                        records[i].timestamp = Date.now();
                    }
                    else if (!records[i].timestamp) {
                        console.log('creating item', records[i]);
                        records[i].timestamp = Date.now();
                    }

                    let index = DATA.findIndex(x => x.id == records[i].id);
                    if (index >= 0)
                        DATA[index] = records[i]
                    else
                        DATA.push(records[i]);
                }
            }
            let json = JSON.stringify(records, null, 2); //JSON.stringify(req.body); 
            //console.log('posted', json);
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(json);
            //console.log('posted OK')
        } catch{
            res.statusCode = 500;
            res.end();
        }
    })
    .listen(8765).then(_ => {
        console.log(`> Running on localhost:8765`);
    });