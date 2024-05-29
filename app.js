const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const syncModels = require("./common/syncModels");
const jwtUtils = require("./common/jwt");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');


const app = express();

app.set("trust proxy", 1);
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// Allow crossed domain requests
app.all("*", function (req, res, next) {
    // Set CORS headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");

    // If request method is OPTIONS, send 200 response
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    // Get token from request headers
    const token = req.headers.authorization;

    // Check if route is in whitelist, if so, proceed without JWT validation
    if (jwtUtils.isRouteInWhitelist(req.path)) {
        return next();
    }

    // Verify JWT
    const decodedToken = jwtUtils.verifyToken(token);
    console.info("Decoded token:", decodedToken);
    if (decodedToken) {
        // JWT validation passed, proceed with the request
        req.user = decodedToken; // Store decoded user information in request
        return next();
    } else {
        // JWT validation failed
        return res.status(401).json({ message: 'Unauthorized' });
    }
});

// Sync Models
syncModels();

app.use('/', indexRouter);
app.use("/api/user", usersRouter);

module.exports = app;