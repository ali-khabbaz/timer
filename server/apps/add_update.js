(function () {

	var jwt = require('../requires.js').jwt,
		showDb = require('../utilities.js').showDb,
		query = '',
		funcs = [],
		q = require('../requires.js').q;

	function addUpdate(req, res) {
		console.log('addUpdate', req.body);
		var result = req.body;
		var query = '';
		if (!req.headers.authorization) {
			return res.status(401).send({
				message: 'you are not authorized'
			});
		}
		var token = req.headers.authorization.split('ali is just.')[1];
		var payload = jwt.decode(token, "shh...");
		if (!payload.sub) {
			return res.status(401).send({
				message: 'authentication failed'
			});
		}
		payload.sub = +payload.sub;
		result.forEach(function (val) {
			query = "INSERT INTO times (user_id , date , begin , end) VALUES " +
				" ( " + payload.sub + " , " + val.date + " , '" + val.begin + "' , '" + val.end + "' ) ";
			console.log('funcsssssssssssssssss', query);
			funcs.push(showDb(query));
		});

		q.all(funcs).then(function () {
			console.log('inserted ok');
		}).fail(function (e) {
			console.log('notttttt inserted ',e);
			return res.status(401).send(e);
		});

	}

	exports.addUpdate = addUpdate;
}());