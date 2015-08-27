# nodemailer-sparkpost-transport
Sparkpost transport for Nodemailer

[![Build Status](https://travis-ci.org/Sparkpost/nodemailer-sparkpost-transport.svg?branch=sm-readme)](https://travis-ci.org/Sparkpost/nodemailer-sparkpost-transport)
[![NPM version](https://badge.fury.io/js/nodemailer-sparkpost-transport.png)](http://badge.fury.io/js/nodemailer-sparkpost-transport)

## Example

```javascript
'use strict';

var nodemailer = require('nodemailer');

var sparkpostTransport = require('nodemailer-sparkpost-transport');

var nodemailer = require('nodemailer');
var sparkpostTransport = require('nodemailer-sparkpost-transport');
// Will use dotenv to load .env variables, passing in options to send with SparkPost
var transporter = nodemailer.createTransport(sparkpostTransport({
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


transport.sendMail({
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

### `sparkpostTransport`

```javascript
sparkpostTransport(options);
```

#### Available options

+ `tags`
+ `meta`
+ `rcpt_metadata`

### `sendMail`

```javascript
transport.sendMail(options, function(err, info) {});
```

#### Available options

+ `to`
+ `cc`
+ `bcc`
+ `from`
+ `subject`
+ `headers`
+ `text`
+ `html`
+ `tags`
+ `meta`
+ `rcpt_metadata`
