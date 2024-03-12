const passjwt = require("passport-jwt")
const passport = require("passport")
const {UsersManager} = require("../dao/db/UsersManager")
const JWTStrategy = passjwt.Strategy
const JWTExtract = passjwt.ExtractJwt
const GitHubStrategy = require('passport-github2').Strategy

const um = new UsersManager()

function cookieExtractor(req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};

function initPass() {
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest:JWTExtract.fromExtractors([cookieExtractor]),
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

     // GitHub Strategy
     passport.use("github",new GitHubStrategy({
        clientID: "Iv1.56d8431d3717c09e",
        clientSecret: "4019d8cb0382d9fb81c7e976f441c61c0217b583",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {

            // Check if user already exists in your database
            let user = await um.userModel.findOne({email:profile._json.email})
            if (!user) {

                // Create a new user in your database
                const newUser = {
                    first_name:profile._json.name,
                    last_name:"",
                    age:18,
                    email:profile._json.email,
                    password:""
                }

                const result = await um.userModel.create(newUser)

                return done(null,result)
            }

            
            return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    }
    ));
}


function checkAuth(req,res,next) {
    return passport.authenticate(["jwt"],{failureRedirect:"/login", session:false})(req,res,next)
}

module.exports = {initPass,checkAuth}