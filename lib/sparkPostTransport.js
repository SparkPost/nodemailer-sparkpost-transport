'use strict';

// Dependencies
var pkg = require('../package');
var SparkPost = require('sparkpost');

// Constructor
var SparkPostTransport = function SparkPostTransport(options) {
  // Set required properties
  this.name = 'SparkPost';
  this.version = pkg.version;
  options = options || {};

  // Set the SparkPost API Key (must have appropriate Transmission resource permissions)
  this.sparkPostApiKey = process.env.SPARKPOST_API_KEY || options.sparkPostApiKey;
  this.sparkPostEmailClient = new SparkPost( this.sparkPostApiKey );

  // Set any options which are valid
  for( var opt in options ) {
    this[opt] = (options.hasOwnProperty( opt )) ? options[opt] : undefined;
  }

  return this;
};

SparkPostTransport.prototype.send = function send(payload, callback) {
  var email = {
    transmissionBody: {}
  };

  // Apply default options and override if provided in mail object
  email.transmissionBody.tags              = (payload.data.tags) ? payload.data.tags : this.tags;
  email.transmissionBody.campaign_id       = (payload.data.campaign_id) ? payload.data.campaign_id : this.campaign_id;
  email.transmissionBody.metadata          = (payload.data.metadata) ? payload.data.metadata : this.metadata;
  email.transmissionBody.substitution_data = (payload.data.substitution_data) ? payload.data.substitution_data : this.substitution_data;
  email.transmissionBody.options           = (payload.data.options) ? payload.data.options : this.options;
  email.transmissionBody.content           = (payload.data.content) ? payload.data.content : this.content;
  email.transmissionBody.recipients        = (payload.data.recipients) ? payload.data.recipients : this.recipients;

  // Send the transmission using Sparkpost
  this.sparkPostEmailClient.transmissions.send(email, function( err, res ) {
    if( err ) {
      return callback( err );
    } else {
      // Example successful Sparkpost transmission response:
      // { "results": { "total_rejected_recipients": 0, "total_accepted_recipients": 1, "id": "66123596945797072" } }
      return callback( null, {
        messageId: res.body.results.id,
        accepted: res.body.results.total_accepted_recipients,
        rejected: res.body.results.total_rejected_recipients
      });
    }
  });
};

module.exports = function(options) {
  return new SparkPostTransport(options);
};
