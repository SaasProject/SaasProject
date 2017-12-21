require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
 
//added by dyan0 --socket.io for realtime
var http = require('http').Server(app);
var io = require('socket.io')(http);

//added by jeremy
require('./models/models');
var mongoose = require('mongoose');
mongoose.connect(config.connectionString);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));
 
// use JWT auth to secure the api   // edited by dyan0: added '/api/users/emailOn'
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register', '/api/users/emailOn'] }));
 
// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));
app.use('/api/devices', require('./controllers/api/devices.controller'));
 
//added by jeremy
app.use('/api/assets', require('./controllers/api/assets.controller'));

//added by dyan0
io.on('connection', function(socket){
    
    //for asset changes in realtime
    socket.on('assetChange', function(){
        console.log('debug2');
        io.emit('assetChange');
    });

    console.log('a user is connected');
    socket.on('disconnect', function(){
        console.log('a user has disconnected');
    })
});

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});
 
// start server --edited by dyan0 from app.listen to http.listen
var server = http.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});