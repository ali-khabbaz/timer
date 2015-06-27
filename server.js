var express = require('./server/requires.js').express,
	app = require('./server/requires.js').app,
	c = require('./server/requires.js').c,
	cluster = require('./server/requires.js').cluster,
	logger = require('./server/requires.js').logger,
	path = require('./server/requires.js').path,
	bodyParser = require('./server/requires.js').bodyParser,
	cookieParser = require('./server/requires.js').cookieParser,
	decode = require('./server/utilities.js').decode,
	numCPUs = require('./server/requires.js').numCPUs,
	q = require('./server/utilities.js').q,
	showDb = require('./server/utilities.js').showDb,
	createToken = require('./server/utilities.js').createToken,
	passport = require('./server/requires.js').passport,
	local_strategy = require('./server/requires.js').local_strategy;


var PORT = 80;
c.connect({
	host: '127.0.0.1',
	user: 'root',
	password: 'bahbah',
	db: 'test_01'
});



if(cluster.isMaster) {
	// Fork workers.
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	cluster.on('exit', function (worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died');
	});
} else {
	// Workers can share any TCP connection
	// In this case its a HTTP server
	app.set('views', __dirname + '/public/views');
	app.set('view engine', 'ejs');
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded());
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, '/public')));
	app.use(passport.initialize());

	passport.serializeUser(function (user, done) {
		console.log('serializeeee', user);
		if (user) {
			done(null, user.id);
		} else {
			done(null, false, {
				message: 'wrong email or password'
			});
		}

	});

	var strategy_opts = {
		usernameField: 'email'
	};

	var login_strategy = new local_strategy(strategy_opts, function (email, password, done) {
		console.log('----------------------call login passport', email, password);
		/*
		in this part we find the user from DB and return user object with username and id
		*/
		showDb("SELECT email , ID FROM users WHERE email = '" + email + "' AND " +
			"password = '" + password + "' ").then(function (result) {
			console.log('result is', result);
			if (result.length === 0) {
				console.log('not user');
				return done(null, false, {
					message: 'wrong email or password'
				});
			} else {
				var user = {
					"email": result[0].email,
					"id": +result[0].ID
				};
				return done(null, user);
			}
		}).fail(function (err) {
			console.log('errrrrrrrrr is', err);
			return done(null, false, {
				message: err
			});
		});

	});

	var register_strategy = new local_strategy(strategy_opts, function (email, password, done) {
		console.log('||||||||||||||||||||||call register passport', email, password);
		var query = "INSERT INTO users (`email`, `password`) VALUES ( '" + email + "' , " +
			" '" + password + "' )";
		showDb(query).then(function (res_1) {
			query = "SELECT email , ID FROM users WHERE email = '" + email + "' AND " +
				"password = '" + password + "' ";

			showDb(query).then(function (res_2) {
				var user = {
					"email": res_2[0].email,
					"id": res_2[0].ID
				};
				done(null, user);

			}).fail(function (err_1) {
				console.log('1', err_1);
				res.send('Errrrrrrrrrrrr : ', err);
			});

		}).fail(function (err_2) {
			console.log('1', err_2);
			res.send('Errrrrrrrrrrrr : ', err);
		});
	});

	passport.use('local-register', register_strategy);
	passport.use('local-login', login_strategy);


	var registerFunction = require('./server/apps/register.js').register;
	var login = require('./server/apps/login.js').login;
	var global = require('./server/apps/global.js').global;
	var pdfServe = require('./server/apps/pdfServe.js').pdfServe;
	var jobs = require('./server/apps/jobs.js').jobs;
	var addUpdate = require('./server/apps/add_update.js').addUpdate;
	var viewGetMonth = require('./server/apps/view_get_month.js').viewGetMonth;



	app.get(/.pdf/, pdfServe);
	//app.post('/app/register', registerFunction);
	// app.post('/app/login', login);

	app.post('/app/register', passport.authenticate('local-register'), function (req, res) {
		var token = createToken(req.user, req);
		res.send({
			user: req.user.email,
			id: req.user.id,
			token: token
		});
	});



	app.post('/app/login', passport.authenticate('local-login'), function (req, res) {
		var token = createToken(req.user, req);
		res.send({
			user: req.user.email,
			id: req.user.id,
			token: token
		});
	});

	app.post('/app/jobs', jobs);
	app.post('/app/add-update', addUpdate);
	app.post('/app/view-get-month', viewGetMonth);
	app.get('/', global);



	app.listen(PORT);
	console.log('listening on port', PORT);
}