const mongoose = require('mongoose');
const { Schema } = mongoose;
const RecipientSchema = require('./Recipient');

const surveySchema = new Schema ({
  title: String,
  subject: String,
  body: String,
  // Subdocument collection
  recipients: [RecipientSchema],
  yes: { type: Number, default: 0 },
  no: { type: Number, default: 0 },
  // Relate to users collection. Convention: _name
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  dateSent: Date,
  lastResponded: Date
});

mongoose.model('surveys', surveySchema);

// Why not further nest survey collection inside user
// User collection contains multi users
// Each user contains multi surveys
// Each survey contains multi recipients
// MongoDB limitation: each record in collection limited to 4MB
// Will hit limit if all surveys stored inside user