const BearerStrategy = require('passport-http-bearer').Strategy;
const Token = require('../models').Token;

const bearerStrategy = new BearerStrategy(async (token, done) => {
    try {
        const auth = await Token.findOne({
            where: {
                token: token,
                status: 1
            }
        });

        if (!auth) {
            return done(null, false);
        }
        return done(null, auth, {scope: 'all'});
    } catch (err) {
        return done(err);
    }
});

module.exports = bearerStrategy;