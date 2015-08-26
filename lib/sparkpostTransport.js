'use strict';

// Load environment configurations
require('dotenv').load();

// Dependencies
var pkg = require('../package');
var sparkpost = require('sparkpost');
var sparkpostApiKey = process.env.SPARKPOST_API_KEY;

// Constructor
var SparkpostTransport = function SparkpostTransport(options) {
  // Set required properties
  this.name = 'Sparkpost';
  this.version = pkg.version;

  options = options || {};

  // Set any options which are valid
  for( var opt in options ) {
    this[opt] = (options.hasOwnProperty( opt )) ? options[opt] : undefined;
  }

  // TODO: Set the SparkPost API Key (must have appropriate Transmission resource permissions)

  // Set the SparkPost Node Client
  this.sparkpostClient = new sparkpost( sparkpostApiKey );
};

SparkpostTransport.prototype.send = function send(mail, callback) {
  console.log( 'HOT 1' );
  var data = mail.data || {};

  // Handle recipients

  // Apply default options and override if provided in mail object
  var tags              = mail.tags || this.tags;
  var metadata          = mail.metadata || this.metadata;
  var substitution_data = mail.substitution_data || this.substitution_data;
  var options           = mail.options || this.options;
  var content           = mail.content || this.content;
  var recipients        = mail.recipients || this.recipients;

  // Send the transmission using Sparkpost
  this.sparkpostClient.transmissions.send({
  }, function( err, res ) {
    if( err ) {
      console.error( err );
      return callback( err );
    } else {
      // Example successful Sparkpost transmission response:
      // { "results": { "total_rejected_recipients": 0, "total_accepted_recipients": 1, "id": "66123596945797072" } }
      console.log( 'res.body: ', res.body );
      return callback( null, {
        messageId: res.body.results.id,
        accepted: res.body.results.total_accepted_recipients,
        rejected: res.body.results.total_rejected_recipients
      });
    }
  });
};

module.exports = function(options) {
  return new SparkpostTransport(options);
};
