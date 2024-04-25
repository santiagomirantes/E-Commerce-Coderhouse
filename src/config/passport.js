const passjwt = require("passport-jwt")
const passport = require("passport")
const {UsersRepository} = require("../dao/factory")
const JWTStrategy = passjwt.Strategy
const JWTExtract = passjwt.ExtractJwt
const GitHubStrategy = require('passport-github2').Strategy

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
        secretOrKey:process.env.SESSION_SECRET
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
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {

            // Check if user already exists in your database
            let user = await UsersRepository.UsersManager.userModel.findOne({email:profile._json.email})
            if (!user) {

                // Create a new user in your database
                const newUser = {
                    first_name:profile._json.name,
                    last_name:"",
                    age:18,
                    email:profile._json.email,
                    password:""
                }

                const result = await UsersRepository.UsersManager.userModel.create(newUser)

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
    const value = passport.authenticate(["jwt"],{failureRedirect:"/login", session:false})(req,res,next)
    return value
}

module.exports = {initPass,checkAuth}