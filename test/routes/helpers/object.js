require('../../../app')

const Record = require('../../../models/record')

const chai = require('chai');
const should = chai.should();

/*Helper method*/
const { minutesAgo, minutesSince } = require('../../test')

const {createRecord, findRecord} = require('../../../routes/helpers/object') 

describe('object helper', function() {

  describe('#createRecord', function(done) {
    beforeEach(function(done) {
      Record.remove({}, function(err) {
        done();
      })
    });

    it('should create new record without error', function(done) {
      Record.create({key: 'bigmac', value: 'mac_value1'}, function(err, res) {

        if (err) return done(err)

        createRecord({key: 'whatever', value: 'value1'}, function(err, res) {

          if (err) return done(err);

          res.should.have.property('key').eql('whatever');
          res.values.should.be.a('Array');
          res.values.length.should.eql(1);
          res.values[0].value.should.eql('value1');
          done()
        })
      });
    });

    it('should upsert record', function(done) {
      Record.create({key: 'whatever', values: { value: 'value1'}}, function(err, res){

        if (err) return done(err)

        createRecord({key: 'whatever', value: {a: 'value2'}}, function(err, res) {

          if (err) return done(err)

          res.should.have.property('key').eql('whatever');
          res.values.should.be.a('Array');
          res.values.length.should.eql(2);
          res.values[1].value.should.eql({a: 'value2'});

          done()
        })
      })
    })

  });

  describe('#find_record', function(done) {
    const timeNow = new Date()

    beforeEach(function(done) {
      Record.insertMany([
        {
          key: 'key1',
          values: [
            {
              value: 1,
              timestamp: minutesAgo(timeNow, 5)
            },
            {
              value: 2,
              timestamp: minutesAgo(timeNow, 2)
            },
            {
              value: {a: 'a', b: 'b'},
              timestamp: timeNow
            }
          ]
        },
        {
          key: 'key2',
          values: {
            value: ['a'],
            timestamp: minutesAgo(timeNow, 2)
          }
        }
      ], function(err, res) {
        if(err) return done(err)
        done()
      })
    })

    it('should find correct record with timestamp', function(done) {
      findRecord({key: 'key1', timestamp: String(minutesAgo(timeNow, 3).getTime())}, function(err, res){

        if(err) return done(err)

        res.should.eql([{value: 1}])
        done()
      })
    });

    it('should find correct record with timestamp', function(done) {
      findRecord({key: 'key1', timestamp: String(timeNow.getTime())}, function(err, res) {

        if(err) return done(err)

        res.should.eql([{value: {a: 'a', b: 'b'}}])
        done()
      })
    });

    it('should find correct record with timestamp', function(done) {
      findRecord({key: 'key1', timestamp: String(parseInt(timeNow.getTime()/1000))}, function(err, res) {

        if(err) return done(err)

        res.should.eql([{value: 2}])
        done()
      })
    })

    it('should return lasted record if no timestamp', function(done) {
      findRecord({key: 'key1'}, function(err, res) {

        if(err) return done(err)

        res.should.eql([{value: {a: 'a', b: 'b'}}])
        done()
      })
    })
  })
});
