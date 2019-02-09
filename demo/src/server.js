import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '../__sapper__/server.js';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

import bodyParser from 'body-parser';

polka() // You can also use Express
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
