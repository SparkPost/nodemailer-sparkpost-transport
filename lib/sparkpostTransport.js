'use strict';

// Dependencies
var pkg = require('../package');

// Constructor
var SparkpostTransport = function SparkpostTransport(options) {
  // Set required properties
  this.name = 'Sparkpost';
  this.version = pkg.version;

  options = options || {};
};

SparkpostTransport.prototype.send = function send(mail, callback) {
  var data = mail.data || {};

  // Handle recipients

  // Apply any non-default options

  // Send the transmission using Sparkpost
};

module.exports = function(options) {
  return new SparkpostTransport(options);
};
