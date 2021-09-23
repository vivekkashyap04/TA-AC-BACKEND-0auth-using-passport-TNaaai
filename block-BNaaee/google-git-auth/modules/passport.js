const passport = require('passport');
const User = require('../models/user');
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var LocalStrategy = require('passport-local').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      var profile = {
        name: profile.displayName,
        username: profile._json.name,
        email: profile._json.name.givenName,
        image: profile._json.picture,
      };
      User.findOne({ email: profile.name.givenName }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          User.create(profile, (err, userdata) => {
            if (err) return done(err);
            return done(null, false);
          });
        }
        done(null, user);
      });
    }
  )
);

//github
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log(profile);
      var profileData = {
        name: profile.displayName,
        username: profile.username,
        email: profile._json.email,
        profilePic: profile._json.avatar_url,
      };

      User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return done(err);
        // console.log(user);
        if (!user) {
          User.create(profileData, (err, addedUser) => {
            if (err) return done(err);
            return done(null, addedUser);
          });
        } else {
          done(null, user);
        }
      });
    }
  )
);

passport.use(
  new LocalStrategy(function (email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
