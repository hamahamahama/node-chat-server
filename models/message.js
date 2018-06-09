const mongoose = require('mongoose');

const Message = mongoose.model('Message', {
  sender: String,
  receiver: String,
  message: String,
  sentAt: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false }
});

module.exports = Message;
