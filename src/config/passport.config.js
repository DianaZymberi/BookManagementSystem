require("dotenv").config();
const passport = require("passport");
const ExtractJWT = require("passport-jwt").ExtractJwt;
const JWTStrategy = require("passport-jwt").Strategy;
const { getById } = require("../models/user.model");

const options = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'process.env.SECRETORKEY',
};

passport.use(
  new JWTStrategy(options, async (jwtPayload, done) => {
    try {
      const user = await getById(jwtPayload.id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      console.error("Error during JWT authentication:", error);
      return done(error, false);
    }
  })
);

module.exports = passport;
