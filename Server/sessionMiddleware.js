const session = require('express-session');
require('dotenv').config();
const cookie = {
    secure: process.env.COOKIE_SECURE === 'true',
    httpOnly: true,
    path: '/',
    maxAge: 3600000,
    sameSite: process.env.COOKIE_SAMESITE || 'lax',
};
if (process.env.COOKIE_DOMAIN) {
    cookie.domain = process.env.COOKIE_DOMAIN;
}

const sessionMiddleware = session({
    secret: 'mySecretKey',
    resave: true,
    name: 'mathGame',
    saveUninitialized: true,
    cookie,
});
module.exports = sessionMiddleware;
