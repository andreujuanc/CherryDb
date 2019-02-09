let DATA = [
	{ text: 'Initial', id: 'cd8375c4-13d1-4aa4-9933-7f93d9d03f6c', timestamp: 123 }
];

export function get(req, res) {
	const found = DATA.filter(x => x.timestamp > req.query.from);
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
};

export function post(req, res) {

	try {
		var records = req.body;
		console.log(records);
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
};