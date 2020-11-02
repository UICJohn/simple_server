const express = require('express');
const router = express.Router();

const {createRecord, findRecord} = require('./helpers/object')

/* GET object */
router.get('/:key', function(req, res, next) {
  findRecord({key: req.params.key, timestamp: req.query.timestamp}, function(err, result) {
    if (err) {
      throw err;
    }

    else if (result.length > 0) {
      res.json(result[0]);
    }

    else {
      res.json({});
    }
  });
});

/* Create object */
router.post('/', function(req, res, next) {

  const key = Object.keys(req.body)[0];

  /* Handle blank body */
  if (!key) return res.json({})

  const data = { key, value: req.body[key] };

  createRecord(data, function(err, result) {

    if (err) {
      console.log(err);
      throw err;
    }

    else {
      const { key } = result;

      const { value, timestamp } = result.values.pop();

      res.json({ key, value, timestamp });
    }

  });
});

module.exports = router;
