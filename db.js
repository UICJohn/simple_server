const MongoClient = require('mongodb').MongoClient;

class Database {
  static async connect(){
    if (this.collection) return this.collection
    var db = await MongoClient.connect(this.url, this.options)
    var dbConn = db.db("simpleServer");
    this.collection = dbConn.collection('objectCollection')
    if(!this.collection) {
      dbConn.createCollection('objectCollection').catch(err => {
        throw err
      })
    }
    return this.collection
  }
}

Database.collection = null

Database.url = 'mongodb://127.0.0.1:27017/simple_server'

Database.options = {
  useNewUrlParser:    true
}

module.exports = { Database }