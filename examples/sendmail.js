'use strict';

/* eslint-disable no-console */
const nodemailer = require('nodemailer')
, sparkPostTransport = require('nodemailer-sparkpost-transport')
, transporter = nodemailer.createTransport(sparkPostTransport({
  'sparkPostApiKey': '<YOUR_API_KEY>',
  'options': {
    'open_tracking': true,
    'click_tracking': true,
    'transactional': true
  },
  'campaign_id': 'Nodemailer Demo'
}));

transporter.sendMail({
  from: 'me@example.com',
  to: 'you@example.net',
  subject: 'Nodemailer + SparkPost = Sheer Awe',
  text: 'Plain text email content',
  html: '<p>Richly <strong>marked up</strong> email content</p>'
}, function(err, info) {
  if (err) {
    console.error(err);
  } else {
    console.log(info);
  }
});

