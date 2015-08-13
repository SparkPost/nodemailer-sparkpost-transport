# nodemailer-sparkpost-transport
Sparkpost transport for Nodemailer

[![Build Status](https://travis-ci.org/Sparkpost/nodemailer-sparkpost-transport.svg?branch=sm-readme)](https://travis-ci.org/Sparkpost/nodemailer-sparkpost-transport)
[![NPM version](https://badge.fury.io/js/nodemailer-sparkpost-transport.png)](http://badge.fury.io/js/nodemailer-sparkpost-transport)

## Example

```javascript
'use strict';

var nodemailer = require('nodemailer');

var sparkpostTransport = require('nodemailer-sparkpost-transport');

var transport = nodemailer.createTransport(sparkpostTransport({
  auth: {
    apiKey: 'key'
  }
}));

var emailBody = {
  from: 'sender@example.com',
  to: 'user@example.com',
  subject: 'Greetings',
  html: '<p>I'm Sparky! How are you?</p>',
  text: 'I'm Sparky! How are you?'
};

transport.sendMail(emailBody, function(err, info) {
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
