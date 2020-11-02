const server = require('../../app')

const Record = require('../../models/record')

const chai = require('chai')
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const should = chai.should();


const {createRecord, findRecord} = require('../../routes/helpers/object') 

const { minutesAgo, minutesSince } = require('../test')


describe('Object', function() {

  describe('POST /object', (done) => {
    beforeEach((done) => {
      Record.remove({}, (err) => {
        done();
      })
    });

    it('it should able to create nested blob object', (done) => {
      const object = { whatever: { a: 1, b: 2 } }

      chai.request(server)
      .post('/object')
      .send(object)
      .end((err, res) => {
        let {key, value} = res.body

        res.should.have.status(200);
        res.body.should.be.a('object');
        key.should.eql('whatever')
        value.should.eql({a: 1, b: 2})
        done();
      });
    });

    it ('it should able to simple object', (done) => {
      const object = { mac: 1 }

      chai.request(server)
      .post('/object')
      .send(object)
      .end((err, res) => {
        let {key, value} = res.body

        res.should.have.status(200);
        res.body.should.be.a('object');
        key.should.eql('mac')
        value.should.eql(1)
        done();
      });
    });

    it ('should hanlde blank body', (done) => {
      chai.request(server)
      .post('/object')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.eql({})
        done();
      });
    })
  });
});