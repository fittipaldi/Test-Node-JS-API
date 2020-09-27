/**
 * @file Configuration for the web server
 */

// load .env configuration before doing anything
require('dotenv').config();

// imports
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const fs = require('fs');
const errorHandler = require('errorhandler');
const path = require('path');
const session = require('express-session');
const db = require('./lib/models');
const cors = require('cors');
const passport = require('passport');
const bearerStrategy = require('./lib/passport/bearer');

// environment: production or development
const runningEnv = process.env.ENVIRONMENT || 'development';
const port = process.env.PORT || 5000;

// Routes instance
const routeStory = require('./routes/story');

process.on('uncaughtException', function (e) {
    console.error('Error: ' + e);
});

const app = express();
if (runningEnv === 'development') {
    app.use(errorHandler());
}

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_ORIGIN || '*'
}));

app.use(session({
    secret: process.env.SESSION_SECRET || '',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: parseInt(process.env.SESSION_EXPIRY || 3600000, 10)
    }
}));

// app.use(bodyParser.json());
app.use(express.json({
    type: 'application/json'
}));
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) => {
    next();
});

passport.use('bearer', bearerStrategy);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    return res.status(200).send('Soccer Team API - Working');
});

// ================== Routers Go Here ==================== //
//router imports
app.use('/story', routeStory);

app.get('/message', (req, res, next) => {
    if (req.session.message && req.session.message.hasOwnProperty('message') && req.session.message.hasOwnProperty('success')) {
        let msg = req.session.message;
        delete req.session.message;
        req.message = msg;
    } else {
        req.message = {};
    }
    next();
}, (req, res) => {
    res.json(req.message);
});

// ======================= Custom Error Handler =============== //
app.use((req, res) => {
    return res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
    if (err.status) {
        const errBody = Object.assign({}, err, {message: err.message});
        return res.status(err.status).json(errBody);
    } else {
        return res.status(500).json({status: false, msg: 'Internal Server Error'});
    }
});

// SSL implementation but it is using reverse proxy
let server, type;
if (process.env.SSL_PRIVATE_KEY && process.env.SSL_CERTIFICATE) {
    type = 'https';
    const privateKey = fs.readFileSync(process.env.SSL_PRIVATE_KEY, 'utf8');
    const certificate = fs.readFileSync(process.env.SSL_CERTIFICATE, 'utf8');
    server = https.createServer({
        key: privateKey,
        cert: certificate
    }, app);
} else {
    type = 'http';
    server = http.createServer(app);
}

server.listen(port, console.log(`Server [${type}] started on port: ${port}`));