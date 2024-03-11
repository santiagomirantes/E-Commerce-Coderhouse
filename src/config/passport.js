const passjwt = require("passport-jwt")
const passport = require("passport")
const {UsersManager} = require("../dao/db/UsersManager")
const Strategy = passjwt.Strategy
const extract = passjwt.ExtractJwt

const um = new UsersManager()

function cookieExtractor(req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};

function initPass() {
    passport.use("jwt", new Strategy({
        jwtFromRequest:extract.fromExtractors([cookieExtractor]),
        secretOrKey:"AF6V<Q$[S!uw9EM*/kTv,5jH6=_T%5^4Apb?<a$PFkU"
    },
     async(jwt_payload,done) => {

        try{
            return done(null,jwt_payload)
        }
        catch(err) {
            return done("Error in JWT Passport", err)
        }
     }
    ))
}

module.exports = {initPass}