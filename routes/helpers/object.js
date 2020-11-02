const Record = require('../../models/record')

// Create or update record
exports.createRecord = (record, callback) => {
  const {key, value} = record

  const query = {key: key};
  const update = {$addToSet: {values: {value: value}}};
  const options = {upsert: true, new: true, useFindAndModify: true};

  Record.findOneAndUpdate(query, update, options, callback);
};

// Query record
exports.findRecord = (query, callback) => {
  let {timestamp} = query;

  if (timestamp && timestamp.length == 10) {
    timestamp = new Date(parseFloat(timestamp) * 1000);
  } else if (timestamp) {
    timestamp = new Date(parseFloat(timestamp));
  } else {
    timestamp = new Date();
  }

  const queryObj = {
    key: query.key,
    
    'values.timestamp': {
      $lte: timestamp,
    },
  };

  Record.aggregate(
    [
      {$unwind: '$values'},

      {$match: queryObj},

      {$sort: {'values.timestamp': -1}},

      {$limit: 1},

      {
        $project: {
          _id: 0,
          value: '$values.value',
        },
      },
    ],
    callback
  );
};
