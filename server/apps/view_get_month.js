(function () {

	var jwt = require('../requires.js').jwt,
		showDb = require('../utilities.js').showDb,
		query = '';

	function viewGetMonth(req, res) {
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
		console.log('payload', payload);
		payload.sub = +payload.sub;
		query = "select id ,date  , begin , end from times where date = "+
		"(select max(date) from times where user_id = "+payload.sub+" ) and user_id = "+payload.sub+" ";
		showDb(query).then(function (result) {
			console.log('resilt', result);
			res.json(result);
		}).fail(function (e) {
			return res.status(401).send({
				message: e
			});
		});

	}

	exports.viewGetMonth = viewGetMonth;
}());