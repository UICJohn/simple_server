const { Database } = require('./db')

async function query(key, timestamp) {
  try {
    let docs = [];
    let query_hash = { key: key }

    // console.log(query_hash)
    docs = await Database.collection.find(query_hash, {key: 1, values: {$slice: 1}}).toArray()
    records = docs[0].values

    records.sort(function (a, b) {
      if (a.timestamp > b.timestamp) return -1;
      if (a.timestamp < b.timestamp) return 1;
      return 0;
    });

    console.log(records) 

    if (timestamp) {      
      for (var i = 0; i < records.length; i++) {
        if (records[i].timestamp <= timestamp) {
          console.log(records[i])
          return records[i]
        }
      }
    } else {
      return records[0]
    }
  } catch(err) {
    console.log(err)
    return
  }
}

async function insertOrUpdate(key, value) {
  try {
    const timestamp = new Date();

    const docs = await Database.collection.find({key: key}).toArray()

    if (docs.length === 1) {
      await Database.collection.updateOne({key: key}, {$addToSet: { values: {value: value, timestamp: timestamp} }})
    } else {
      await Database.collection.insertOne({key: key, values: [{ value: value, timestamp: new Date()}]})
    }

    return {key: key, value: value, timestamp: timestamp}

  } catch(err) {
    console.log(err)
    return
  }
}

module.exports = {
  query: query,
  insertOrUpdate: insertOrUpdate
}