'use strict';

var sinon = require('sinon');
var expect = require('chai').expect;

var sparkpostTransport = require('../');

var pkg = require('../package.json');

describe('SparkPost Transport Tests', function() {
  var transport = sparkpostTransport();

  it('should have a name and version property', function(done) {
    expect(transport).to.have.property('name', 'Sparkpost');
    expect(transport).to.have.property('version', pkg.version);
    done();
  });

  it('should expose a send method', function(done) {
    expect(transport.send).to.exist;
    expect(transport.send).to.be.a('function');
    done();
  });
});

describe('Send Method', function() {
  // TODO: Handle exceptions
  // Respond with appropriate data per Nodemailer spec
});
