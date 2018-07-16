<a href="https://www.sparkpost.com"><img src="https://www.sparkpost.com/sites/default/files/attachments/SparkPost_Logo_2-Color_Gray-Orange_RGB.svg" width="200px"/></a>

[Sign up](https://app.sparkpost.com/join?plan=free-0817?src=Social%20Media&sfdcid=70160000000pqBb&pc=GitHubSignUp&utm_source=github&utm_medium=social-media&utm_campaign=github&utm_content=sign-up) for a SparkPost account and visit our [Developer Hub](https://developers.sparkpost.com) for even more content.

# SparkPost transport for Nodemailer
## nodemailer-sparkpost-transport

[![Build Status](https://travis-ci.org/SparkPost/nodemailer-sparkpost-transport.svg?branch=master)](https://travis-ci.org/SparkPost/nodemailer-sparkpost-transport)
[![NPM version](https://badge.fury.io/js/nodemailer-sparkpost-transport.png)](http://badge.fury.io/js/nodemailer-sparkpost-transport) [![Slack Status](http://slack.sparkpost.com/badge.svg)](http://slack.sparkpost.com)

## Usage

### Install

```
npm install nodemailer-sparkpost-transport
```

### Create a Nodemailer transport object

```javascript
var nodemailer = require('nodemailer');
var sparkPostTransport = require('nodemailer-sparkpost-transport');
var transporter = nodemailer.createTransport(sparkPostTransport(options));
```

where:

  - **options** defines connection _default_ transmission properties
    - `sparkPostApiKey` - SparkPost [API Key](https://app.sparkpost.com/account/credentials). If not provided, it will use the `SPARKPOST_API_KEY` env var.
    - `endpoint` - The endpoint to use for the SparkPost API requests. If you have a SparkPost EU account, set this to `https://api.eu.sparkpost.com` (optional)
    - `campaign_id` - Name of the campaign (optional)
    - `metadata` - Transmission level metadata containing key/value pairs (optional)
    - `options` - JSON object in which transmission options are defined (optional)
    - `substitution_data` - Key/value pairs that are provided to the substitution engine (optional)

  For more information, see the [SparkPost API Documentation for Transmissions](https://developers.sparkpost.com/api/transmissions)

## Send a message

```javascript
transport.sendMail({
  from: 'me@here.com',
  to: 'you@there.com',
  subject: 'Very important stuff',
  text: 'Plain text',
  html: 'Rich taggery'
}, function(err, info) {
  if (err) {
    console.log('Error: ' + err);
  } else {
    console.log('Success: ' + info);
  }
});
```

[Read more about Nodemailer's `sendMail()` method here](https://github.com/nodemailer/nodemailer#sending-mail).

### Additional Options

The SparkPost Nodemailer transport also supports a few SparkPost-specific `sendMail()` options in both the transport constructor and the 'sendMail()` method.

Note: `sendMail()` options override their constructor counterparts:

  - **options**
    - `campaign_id` - Overrides for constructor option
    - `metadata` - Override for constructor option
    - `options` - Override for constructor option
    - `substitution_data` - Override for constructor option
