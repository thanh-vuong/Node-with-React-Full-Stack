const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');

const Survey = mongoose.model('surveys');

module.exports = app => {
  app.post(
    '/api/surveys',
    requireLogin,
    requireCredits,
    (req, res) => {
      const { title, subject, body, recipients } = req.body;
      const survey = new Survey({
        title,
        subject,
        body,
        // Split recipients string by comma, into array of obj, trim white space
        // recipients: recipients.split(',').map(email => ({ email:email.trim() })),
        recipients: recipients.split(',').map(email => email.trim()),
        _user: req.user.id,
        dateSent: Date.now()
      });
    }
  )
}

// ES6 syntax shortening
// recipients.split(',').map(email => { return { email: email.trim() }})
// Arrow func consisting of only return statement
// recipients.split(',').map(email => {email: email.trim()})
// Add parans to make clear func body instead of obj
// recipients.split(',').map(email => ({email: email.trim()}))