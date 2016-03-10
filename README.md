# nodemailer-sparkpost-transport

SparkPost transport for Nodemailer

[![Build Status](https://travis-ci.org/SparkPost/nodemailer-sparkpost-transport.svg?branch=master)](https://travis-ci.org/Sparkpost/nodemailer-sparkpost-transport)
[![NPM version](https://badge.fury.io/js/nodemailer-sparkpost-transport.png)](http://badge.fury.io/js/nodemailer-sparkpost-transport) [![Slack Status](http://slack.sparkpost.com/badge.svg)](http://slack.sparkpost.com)

## Installation

```
npm install nodemailer-sparkpost-transport
```

## Example

```javascript
'use strict';

var nodemailer = require('nodemailer');
var sparkPostTransport = require('nodemailer-sparkpost-transport');

// Will use dotenv to load .env variables, passing in options to send with SparkPost
var transporter = nodemailer.createTransport(sparkPostTransport({
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

## Documentation

### `sparkPostTransport`

```javascript
sparkPostTransport(options);
```

#### Available options

+ `campaign_id`
+ `content`
+ `metadata`
+ `options`
+ `sparkPostApiKey`
+ `substitution_data`
+ `tags`

### `sendMail`

```javascript
transport.sendMail(options, function(err, info) {});
```

#### Available options

+ `campaign_id`
+ `content`
+ `metadata`
+ `options`
+ `recipients`
+ `substitution_data`
+ `tags`
