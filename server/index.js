// access Express lib, via CommonJS modules system
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');

const app = express();

// careful of order of operations
// eg: must create user model first in user.js
// before using it in passport.js
const keys = require('./config/keys');
require('./models/user');
require('./services/passport');
require('./models/Survey');


// get port from server runtime env or 5000 if not available
const PORT = process.env.PORT || 5000

app.listen(PORT);

// Express server doesn't parse POST/PUT/PATCH request payload
// Middleware to parse payload into json
app.use(bodyParser.json());

app.use(
  // middleware extracts cookie, assigns to a session
  cookieSession({
    // 30 days in milisec, encrypted cookie
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

// middleware extracts user from session
app.use(passport.initialize());
app.use(passport.session());
require('./routes/authRoutes')(app);
require ('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

// On prod env, no longer has separate client server
// Express server needs to handle requests for client assets
if (process.env.NODE_ENV === 'production') {
  // Express serve prod build assets like main.js or main.css
  // when asked for specific files
  app.use(express.static('client/build'));

  // Express serve index.html if no route or file recognized
  const path = require('path');
  app.get(
    '*',
    (req, res) => {
      res.sendFile(
        path.resolve(
          __dirname,
          'client',
          'build',
          'index.html'
        )
      );
    }
  )
}

mongoose.connect(keys.mongoURI);