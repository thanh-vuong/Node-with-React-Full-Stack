const passport = require('passport');

// need ref to app object
// return module as a function to be invoked
// by app in index.js
module.exports = app => {

  // handle initial google auth request
  app.get(
    '/auth/google',
    passport.authenticate(
      'google', 
      { scope: ['profile', 'email'] }
    )
  );

  // handle callback URI from google
  app.get(
    '/auth/google/callback',
    // Intercept callback request, authenticate
    passport.authenticate('google'),
    // Pass request on to next
    (req, res) => {
      res.redirect('/surveys');
    }
  );

  // Full http request logout is simpler but slower
  // because page refreshes
  // Ajax request is more complex but faster because
  // no refresh
  app.get(
    '/api/logout', 
    (req, res) => {
      req.logout();
      res.redirect('/');
    }
  );

  // handler for testing auth
  app.get('/api/current_user', (req, res) => {
    // send user data to client
    res.send(req.user);
  });
  
  app.get('/api/show_session', (req, res) => {
    res.send(req.session);
  });

};