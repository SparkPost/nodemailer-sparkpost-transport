# nodemailer-sparkpost-transport

SparkPost transport for Nodemailer

[![Build Status](https://travis-ci.org/SparkPost/nodemailer-sparkpost-transport.svg?branch=master)](https://travis-ci.org/Sparkpost/nodemailer-sparkpost-transport)
[![NPM version](https://badge.fury.io/js/nodemailer-sparkpost-transport.png)](http://badge.fury.io/js/nodemailer-sparkpost-transport) [![Slack Status](http://slack.sparkpost.com/badge.svg)](http://slack.sparkpost.com)

## Usage

Install with npm

```
npm install nodemailer-sparkpost-transport
```

Require to your script

```javascript
var nodemailer = require('nodemailer');
var sparkPostTransport = require('nodemailer-sparkpost-transport');
```

Create a Nodemailer transport object

```javascript
var transporter = nodemailer.createTransport(sparkPostTransport(options))
```

Where

  - **options** defines connection and message data
    - `sparkPostApiKey` - SparkPost [API Key](https://app.sparkpost.com/account/credentials). If not provided, it will use the `SPARKPOST_API_KEY` env var.
    - `campaign_id` - Name of the campaign
    - `content` - Content that will be used to construct a message
    - `metadata` - Transmission level metadata containing key/value pairs
    - `options` - JSON object in which transmission options are defined
    - `substitution_data` - Key/value pairs that are provided to the substitution engine

  For more information, see the [SparkPost API Documentation for Transmissions](https://developers.sparkpost.com/api/#/reference/transmissions)



Send a message

```javascript
transport.sendMail(options, function(err, info) {});
```

Where

  - **options** defines connection and message data
    - `recipients` - Inline recipient objects or object containing stored recipient list ID. See [SparkPost API Documentation for Recipient Lists](https://developers.sparkpost.com/api/#/reference/recipient-lists) for more information.
    - `campaign_id` - Override for option above
    - `content` - Override for option above
    - `metadata` - Override for option above
    - `options` - Override for option above
    - `substitution_data` - Override for option above

## Example

```javascript
'use strict';

var nodemailer = require('nodemailer');
var sparkPostTransport = require('nodemailer-sparkpost-transport');

var transporter = nodemailer.createTransport(sparkPostTransport({
  "sparkPostApiKey": "<YOUR_API_KEY>",
  "options": {
    "open_tracking": true,
    "click_tracking": true,
    "transactional": true
  },
  "campaign_id": "Nodemailer Default",
  "metadata": {
    "some_useful_metadata": "testing_sparkpost"
  },
  "substitution_data": {
    "sender": "YOUR NAME",
    "fullName": "YOUR NAME",
    "productName": "The coolest product ever",
    "sparkpostSupportEmail": "support@sparkpost.com",
    "sparkpostSupportPhone": "123-456-7890"
  },
  "content": {
    "template_id": "ADD YOUR TEMPLATE ID HERE"
  }
}));


transporter.sendMail({
  "recipients": [
    {
      "address": {
        "email": "CHANGE TO YOUR TARGET TEST EMAIL",
        "name": "CHANGE TO YOUR RECIPIENT NAME"
      }
    }
  ]
}, function(err, info) {
  if (err) {
    console.error(err);
  } else {
    console.log(info);
  }
});
```
