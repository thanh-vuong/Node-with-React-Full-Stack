const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  // Receive POST req
  app.post(
    '/api/stripe',
    // only need this middleware on certain routes
    requireLogin,
    async (req, res) => {
      const charge = await stripe.charges.create({
        amount: 500,
        currency: 'usd',
        description: '5 email credits',
        // get token from payload using middleware
        source: req.body.id
      });
      console.log();
      
      // Update user, save DB, send user data
      req.user.credits += 5;
      const user = await req.user.save();
      res.send(user);
    }
  );
};