// Use should for BBD
const should = require('chai').should();
const request = require('supertest');

// test for GET /reviews/meta
describe('Test GET /reviews/meta', () => {

  it('Simple test', () => {
    request('http://127.0.0.1')
      .get('/reviews/meta')
      .end((err, res) => {
        res.status.should.be(501)
      });
  });

});