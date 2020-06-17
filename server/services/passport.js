const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');

// model already created, now load
// don't require user.js again which would
// create model again
const User = mongoose.model('users');

// put id into token to be given to client
passport.serializeUser((user, done) => {
  // id is _id in mongoDB
  done(null, user.id);
});

// get id from session, find user in DB
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    });
});

passport.use(
  new GoogleStrategy(
  {
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    // there's a proxy between client and host heroku
    // might use wrong protocol in full url (http/https)
    proxy: true
  },
  // (accessToken, refreshToken, profile, done) => {
  //   // console.log('access token: ', accessToken);
  //   // console.log('refresh token: ', refreshToken);
  //   // console.log('profile: ', profile);

  //   // function returns a "promise", can chain function to it
  //   User.findOne({ googleId: profile.id })
  //     .then((existingUser) => {
  //       if (existingUser) {
  //         done(null, existingUser);
  //       } else {
  //         // save op is async. Only call done after completion
  //         new User({ googleId: profile.id })
  //           .save()
  //           .then(user => done(null, user));
  //       }
  //     });
  // })
  
  async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({ googleId: profile.id })
      if (existingUser) {
        return done(null, existingUser);
      }
      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
  })
);



// function get a blob of json (ajax request)
// http://rallycoding.herokuapp.com/api/music_albums
// function fetchAlbums() {
//   fetch('http://rallycoding.herokuapp.com/api/music_albums')
//     .then(res => res.json())
//     .then(json => console.log(json));
// }

// new syntax, still use promises behind the scenes
// put async when declaring func containing async req
// put await when calling async func
// async function fetchAlbums() {
// const fetchAlbums = async () => {
//   const res = await fetch('http://rallycoding.herokuapp.com/api/music_albums')
//   const json = await res.json()
//   console.log(json);
// }

// fetchAlbums();