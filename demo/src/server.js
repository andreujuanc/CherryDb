import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '../__sapper__/server.js';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

import bodyParser from 'body-parser';


import hub from './hub';

const server = require('http').createServer();
polka({ server })
	.use(bodyParser.urlencoded({
		extended: true
	}))
	.use(bodyParser.json())
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});

const io = require('socket.io')(server);
hub.setSocket(io);
io.on('connection', () => {
	console.log('someone connected')
	hub.dataChanged();
});

