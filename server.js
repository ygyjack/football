//#!/bin/env node
////  OpenShift sample Node application
//var express    = require('express');
//var fs         = require('fs');
//
//var bodyParser = require('body-parser');
//var cors       = require('cors');
//var morgan     = require('morgan');
//
//var mongoose = require('mongoose');
//var dbconnection = 'mongodb://' + 
//	process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' + 
//	process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' + 
//	process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + 
//	process.env.OPENSHIFT_MONGODB_DB_PORT + '/' + 
//	process.env.OPENSHIFT_APP_NAME;
//mongoose.connect(dbconnection);
//
//var app = express();
//
//
//
//
//
//var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
//    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
//    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
//    mongoURLLabel = "";
//
//if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
//  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
//      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
//      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
//      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
//      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
//      mongoUser = process.env[mongoServiceName + '_USER'];
//
//  if (mongoHost && mongoPort && mongoDatabase) {
//    mongoURLLabel = mongoURL = 'mongodb://';
//    if (mongoUser && mongoPassword) {
//      mongoURL += mongoUser + ':' + mongoPassword + '@';
//    }
//    // Provide UI label that excludes user id and pw
//    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
//    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
//
//  }
//
//
//
//
///**
// *  Define the sample application.
// */
//var SampleApp = function() {
//
//    //  Scope.
//    var self = this;
//
//    /*  ================================================================  */
//    /*  Helper functions.                                                 */
//    /*  ================================================================  */
//
//    /**
//     *  Set up server IP address and port # using env variables/defaults.
//     */
//    self.setupVariables = function() {
//        //  Set the environment variables we need.
//        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
//        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;
//
//        if (typeof self.ipaddress === "undefined") {
//            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
//            //  allows us to run/test the app locally.
//            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
//            self.ipaddress = "127.0.0.1";
//        };
//    };
//
//
//    /**
//     *  Populate the cache.
//     */
//    self.populateCache = function() {
//        if (typeof self.zcache === "undefined") {
//            self.zcache = { 'index.html': '' };
//        }
//
//        //  Local cache for static content.
//        self.zcache['index.html'] = fs.readFileSync('./index.html');
//    };
//
//
//    /**
//     *  Retrieve entry (content) from cache.
//     *  @param {string} key  Key identifying content to retrieve from cache.
//     */
//    self.cache_get = function(key) { return self.zcache[key]; };
//
//
//    /**
//     *  terminator === the termination handler
//     *  Terminate server on receipt of the specified signal.
//     *  @param {string} sig  Signal to terminate on.
//     */
//    self.terminator = function(sig){
//        if (typeof sig === "string") {
//           console.log('%s: Received %s - terminating sample app ...',
//                       Date(Date.now()), sig);
//           process.exit(1);
//        }
//        console.log('%s: Node server stopped.', Date(Date.now()) );
//    };
//
//
//    /**
//     *  Setup termination handlers (for exit and a list of signals).
//     */
//    self.setupTerminationHandlers = function(){
//        //  Process on exit and signals.
//        process.on('exit', function() { self.terminator(); });
//
//        // Removed 'SIGPIPE' from the list - bugz 852598.
//        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
//         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
//        ].forEach(function(element, index, array) {
//            process.on(element, function() { self.terminator(element); });
//        });
//    };
//
//
//    /*  ================================================================  */
//    /*  App server functions (main app logic here).                       */
//    /*  ================================================================  */
//
//    /**
//     *  Create the routing table entries + handlers for the application.
//     */
//    self.createRoutes = function() {
//        self.routes = { };
//
//        self.routes['/asciimo'] = function(req, res) {
//            var link = "http://i.imgur.com/kmbjB.png";
//            res.send("<html><body><img src='" + link + "'></body></html>");
//        };
//
//        self.routes['/'] = function(req, res) {
//            res.setHeader('Content-Type', 'text/html');
//            res.send(self.cache_get('index.html') );
//        };
//        
//        self.routes['/users'] = function(req, res) {
//            res.setHeader('Content-Type', 'application/json');
//            var name = req.body.name;
//            res.send(JSON.stringify({ data: name }));
//        };
//        
//        
//        self.routes['/listusers'] = function(req, res) {
//            res.setHeader('Content-Type', 'application/json');
//            User.find(function(err, users) {
//                if (err) res.send(err);
//                res.json(users);
//            });
//        };
//        
//        self.routes['/adduser/:user_id'] = function(req, res) {
//            res.setHeader('Content-Type', 'application/json');
//            var user = new User();
//            user.name = req.params.user_id;
//            user.save(function(err) {
//                if (err) res.send(err);
//                res.send(JSON.stringify({ data: id, message: 'User created!' }));
//            });
//        };
//        
//        self.routes['/users/:user_id'] = function(req, res) {
//            res.setHeader('Content-Type', 'application/json');
//            var id = req.params.user_id;
//            res.send(JSON.stringify({ db: dbconnection, data: id }));
//        };
//        
//    };
//
//
//    /**
//     *  Initialize the server (express) and create the routes and register
//     *  the handlers.
//     */
//    self.initializeServer = function() {
//        self.createRoutes();
//        self.app = express.createServer();
//        
//
//        
//        // configure cors
//        //self.app.use(cors());
//        
//        //  Add handlers for the app (from the routes).
////        for (var r in self.routes) {
////            self.app.get(r, self.routes[r]);
////        }
//    };
//
//
//    /**
//     *  Initializes the sample application.
//     */
//    self.initialize = function() {
//        //self.setupVariables();
//        self.populateCache();
//        self.setupTerminationHandlers();
//
//        // Create the express server and routes.
//        //self.initializeServer();
//    };
//
//
//    /**
//     *  Start the server (starts up the sample application).
//     */
//    self.start = function() {
//        //  Start the app on the specific interface (and port).
//        self.app.listen(self.port, self.ipaddress, function() {
//            console.log('%s: Node server started on %s:%d ...',
//                        Date(Date.now() ), self.ipaddress, self.port);
//        });
//    };
//
//};   /*  Sample Application.  */
//
//
//
///**
// *  main():  Main code.
// */
//var zapp = new SampleApp();
//zapp.initialize();
//
//
////app = express.createServer();
//
//
//
////var methodOverride = require('method-override');
//app.use(morgan('dev'));
//app.use(bodyParser.urlencoded({'extended':'true'}));
//app.use(bodyParser.json());
//app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
////app.use(methodOverride());
//app.use(cors());
//
//
//require('./app/userRoutes.js')(app);
//require('./app/expenseRoutes.js')(app);
//
////var User = require('./app/models/user');
////app.get('/api/users', function(req, res) {
////    User.find(function(err, data) {
////        if (err) res.send(err)
////        res.send(JSON.stringify({data:data}));
////    });
////});
//
//
//
//var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
//var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;
//if (typeof ipaddress === "undefined") {
//    //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
//    //  allows us to run/test the app locally.
//    console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
//    ipaddress = "127.0.0.1";
//};
//app.listen(port, ipaddress, function() {
//    console.log('%s: Node server started on %s:%d ...', Date(Date.now() ), ipaddress, port);
//});
//


//zapp.start();












//// set up ======================================================================
//var express  = require('express');
//var app      = express(); 						// create our app w/ express
//var mongoose = require('mongoose'); 			// mongoose for mongodb
////var port  	 = process.env.PORT || 8080; 		// set the port
//var port  	 = process.env.OPENSHIFT_NODEJS_PORT || 8080;
//
//
//var morgan = require('morgan'); 		              // log requests to the console (express4)
//var bodyParser = require('body-parser'); 	          // pull information from HTML POST (express4)
////var methodOverride = require('method-override');      // simulate DELETE and PUT (express4)
////
////app.use(morgan('dev')); 										// log every request to the console
////app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
////app.use(bodyParser.json()); 									// parse application/json
////app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
////app.use(methodOverride());
//
//// routes ======================================================================
//require('./app/routes.js')(app);
//
//// listen (start app with node server.js) ======================================
//app.listen(port);
//console.log("App listening on port " + port);









//
//
//// BASE SETUP
//// =============================================================================
//
//var app        = express();
//
//// configure app
//app.use(morgan('dev')); // log requests to the console
//
//// configure body parser
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());
//
//// configure cors
//app.use(cors());
//
//var port     = process.env.PORT || 8084; // set our port
//
//var mongoose = require('mongoose');
//mongoose.connect('mongodb://127.10.113.130:27017/projectdb'); // connect to database
//
////require('./app/user.js')(app);
//
//// routes ======================================================================
//var User       = require('./app/models/user');
//
//// ROUTES FOR OUR API
//// =============================================================================
//// create our router
//var router = express.Router();
//
//// middleware to use for all requests
//router.use(function(req, res, next) {
//	// do logging
//	console.log('Something is happening.');
//	next();
//});
//
//// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
//router.get('/', function(req, res) {
//	res.json({ message: 'hooray! welcome to our api!' });	
//});
//
//// on routes that end in /users
//// ----------------------------------------------------
//router.route('/users')
//	// create a user (accessed at POST http://localhost:8080/api/users)
//	.post(function(req, res) {
//        
//        console.log("req.body",req.body);
//        
//		var user = new User();		// create a new instance of the User model
//		user.name = req.body.name;  // set the users name (comes from the request)
//		user.save(function(err) {
//			if (err) res.send(err);
//			res.json({ message: 'User created!' });
//		});
//	})
//	// get all the users (accessed at GET http://localhost:8080/api/users)
//	.get(function(req, res) {
//		User.find(function(err, users) {
//			if (err) res.send(err);
//			res.json(users);
//		});
//	});
//// on routes that end in /users/:user_id
//// ----------------------------------------------------
//router.route('/users/:user_id')
//	// get the user with that id
//	.get(function(req, res) {
//		User.findById(req.params.user_id, function(err, user) {
//			if (err)
//				res.send(err);
//			res.json(user);
//		});
//	})
//	// update the user with this id
//	.put(function(req, res) {
//		User.findById(req.params.user_id, function(err, user) {
//			if (err) res.send(err);
//			user.name = req.body.name;
//			user.save(function(err) {
//				if (err) res.send(err);
//				res.json({ message: 'User updated!' });
//			});
//		});
//	})
//	// delete the user with this id
//	.delete(function(req, res) {
//		User.remove({
//			_id: req.params.user_id
//		}, function(err, user) {
//			if (err) res.send(err);
//			res.json({ message: 'Successfully deleted' });
//		});
//	});
//
//// REGISTER OUR ROUTES -------------------------------
//app.use('/api', router);
//
//// START THE SERVER
//// =============================================================================
//app.listen(port);
//console.log('Magic happens on port ' + port);


















































//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');
    
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))
//
//var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
//    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
//    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
//    mongoURLLabel = "";
//
//if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
//  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
//      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
//      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
//      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
//      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
//      mongoUser = process.env[mongoServiceName + '_USER'];
//
//  if (mongoHost && mongoPort && mongoDatabase) {
//    mongoURLLabel = mongoURL = 'mongodb://';
//    if (mongoUser && mongoPassword) {
//      mongoURL += mongoUser + ':' + mongoPassword + '@';
//    }
//    // Provide UI label that excludes user id and pw
//    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
//    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
//
//  }
//}
//var db = null,
//    dbDetails = new Object();
//
//var initDb = function(callback) {
//  if (mongoURL == null) return;
//
//  var mongodb = require('mongodb');
//  if (mongodb == null) return;
//
//  mongodb.connect(mongoURL, function(err, conn) {
//    if (err) {
//      callback(err);
//      return;
//    }
//
//    db = conn;
//    dbDetails.databaseName = db.databaseName;
//    dbDetails.url = mongoURLLabel;
//    dbDetails.type = 'MongoDB';
//
//    console.log('Connected to MongoDB at: %s', mongoURL);
//  });
//};
//
//app.get('/', function (req, res) {
//  // try to initialize the db on every request if it's not already
//  // initialized.
//  if (!db) {
//    initDb(function(err){});
//  }
//  if (db) {
//    var col = db.collection('counts');
//    // Create a document with request IP and current time of request
//    col.insert({ip: req.ip, date: Date.now()});
//    col.count(function(err, count){
//      res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails });
//    });
//  } else {
//    res.render('index.html', { pageCountMessage : null});
//  }
//});
//
//app.get('/pagecount', function (req, res) {
//  // try to initialize the db on every request if it's not already
//  // initialized.
//  if (!db) {
//    initDb(function(err){});
//  }
//  if (db) {
//    db.collection('counts').count(function(err, count ){
//      res.send('{ pageCount: ' + count + '}');
//    });
//  } else {
//    res.send('{ pageCount: -1 }');
//  }
//});
//
//// error handling
//app.use(function(err, req, res, next){
//  console.error(err.stack);
//  res.status(500).send('Something bad happened!');
//});
//
//initDb(function(err){
//  console.log('Error connecting to Mongo. Message:\n'+err);
//});
//
//app.listen(port, ip);
//console.log('Server running on http://%s:%s', ip, port);
//
//module.exports = app ;