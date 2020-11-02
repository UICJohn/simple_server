const mongoose = require('mongoose');

/* define schema */
const recordSchema = mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  values: [
    {
      value: {
        type:     mongoose.Mixed,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

/* Create model*/
module.exports = mongoose.model('Record', recordSchema);
