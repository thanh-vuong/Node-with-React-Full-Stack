const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// or const { Schema } = mongoose; preferred

// mongoDB doesn't require uniform records in a collection
// but mongoose does
const userSchema = new Schema({
  googleId: String,
  credits: { type: Number, default: 0 }
});

mongoose.model('users', userSchema);