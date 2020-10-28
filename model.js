const { Database } = require('./db')

async function query(key, timestamp) {
  let docs = [];
  let query_hash = { key: key }

  if (timestamp) {
     query_hash.timestamp = {'$lte': timestamp}
  } 

  docs = await Database.collection.find(query_hash).sort({'timestamp': -1}).toArray()

  return docs[0]
}

async function insertOne(key, value) {
  return await Database.collection.insertOne({key: key, value: value, timestamp: new Date()})
}

module.exports = {
  query: query,
  insertOne: insertOne
}