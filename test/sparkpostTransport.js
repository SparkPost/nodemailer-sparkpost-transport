'use strict';

const sinon = require('sinon')
, expect = require('chai').expect
, nodemailer = require('nodemailer')
, sparkPostTransport = require('../lib/sparkPostTransport.js')
, pkg = require('../package.json');

describe('SparkPost Transport', function() {
  const transport = sparkPostTransport({sparkPostApiKey: '12345678901234567890'});

  it('should have a name and version property', function(done) {
    expect(transport).to.have.property('name', 'SparkPost');
    expect(transport).to.have.property('version', pkg.version);
    done();
  });

  it('should expose a send method', function(done) {
    expect(transport.send).to.exist;
    expect(transport.send).to.be.a('function');
    done();
  });

  it('should be able to set options', function(done) {
    const transport = sparkPostTransport({
      sparkPostApiKey: '12345678901234567890',
      endpoint: 'https://api.eu.sparkpost.com',
      campaign_id: 'sample_campaign',
      tags: ['new-account-notification'],
      metadata: {'source': 'event'},
      substitution_data: {'salutatory': 'Welcome to SparkPost!'},
      options: {'click_tracking': true, 'open_tracking': true},
      content: {'template_id': 'newAccountNotification'},
      recipients: [{'email': 'john.doe@example.com', 'name': 'John Doe'}]
    });

    expect(transport.endpoint).to.equal('https://api.eu.sparkpost.com');
    expect(transport.campaign_id).to.equal('sample_campaign');
    expect(transport.tags).to.deep.equal(['new-account-notification']);
    expect(transport.metadata).to.deep.equal({'source': 'event'});
    expect(transport.substitution_data).to.deep.equal({'salutatory': 'Welcome to SparkPost!'});
    expect(transport.options).to.deep.equal({'click_tracking': true, 'open_tracking': true});
    expect(transport.content).to.deep.equal({'template_id': 'newAccountNotification'});
    expect(transport.recipients).to.deep.equal([{'email': 'john.doe@example.com', 'name': 'John Doe'}]);

    done();
  });

});

describe('Send Method', function() {

  describe('SP-centric mail structure', function() {
    it('should be able to overload options at the transmission', function(done) {
      // Create the default transport
      const transport = sparkPostTransport({
        sparkPostApiKey: '12345678901234567890',
        campaign_id: 'sample_campaign',
        tags: ['new-account-notification'],
        metadata: {'source': 'event'},
        substitution_data: {'salutatory': 'Welcome to SparkPost!'},
        options: {'click_tracking': true, 'open_tracking': true},
        content: {'template_id': 'newAccountNotification'},
        recipients: [{'email': 'john.doe@example.com', 'name': 'John Doe'}]
      });

      // Create the modified options for use with the above stub test
      // eslint-disable-next-line one-var
      const overloadedTransmission = {
        campaign_id: 'another_sample_campaign',
        tags: ['alternative-tag'],
        metadata: {'changedKey': 'value'},
        substitution_data: {'salutatory': 'And now...for something completely different'},
        options: {'click_tracking': false, 'open_tracking': false, 'transactional': true},
        recipients: [{
          list_id: 'myStoredRecipientTestList'
        }],
        content: {
          template_id: 'someOtherTemplate'
        }
      };

      // Stub the send method of the SDK out
      sinon.stub(transport, 'send', function(data, resolve) {
        // Grab the transmission body from the send() payload for assertions
        expect(data.campaign_id).to.equal('another_sample_campaign');
        expect(data.tags).to.deep.equal(['alternative-tag']);
        expect(data.metadata).to.deep.equal({'changedKey': 'value'});
        expect(data.substitution_data).to.deep.equal({'salutatory': 'And now...for something completely different'});
        expect(data.options).to.deep.equal({'click_tracking': false, 'open_tracking': false, 'transactional': true});
        expect(data.content).to.deep.equal({'template_id': 'someOtherTemplate'});
        expect(data.recipients).to.deep.equal([{'list_id': 'myStoredRecipientTestList'}]);

        // Resolve the stub's spy
        resolve({
          results: {
            total_rejected_recipients: 0,
            total_accepted_recipients: 1,
            id: '66123596945797072'
          }
        });
      });

      // Call the stub from above
      transport.send(overloadedTransmission, function(data) {
        expect(data.results.id).to.exist;
        expect(data.results.total_rejected_recipients).to.exist;
        expect(data.results.total_accepted_recipients).to.exist;
        done();
      });
      // Return the original method to its proper state
      transport.send.restore();
    });
  });

  describe('conventional nodemailer mail structure', function() {
    let sptrans
      , transport
      , mail
      , rcp1
      , rcp2;

    function checkRecipientsFromFld(mail, infld, val, outfld, done) {
      mail[infld] = val;
      transport.sendMail(mail, function() {
        const transBody = sptrans.sparkPostEmailClient.transmissions.send.firstCall.args[0];

        expect(transBody).to.include.keys(['recipients', 'content']);
        expect(transBody[outfld]).to.have.length(2);
        expect(transBody[outfld][0]).to.deep.equal({ address: rcp1 });
        expect(transBody[outfld][1]).to.deep.equal({ address: rcp2 });
        done();
      });
    }

    beforeEach(function() {
      sptrans = sparkPostTransport({
        sparkPostApiKey: '12345678901234567890'
      });

      transport = nodemailer.createTransport(sptrans);

      rcp1 = 'Mrs. Asoni <a@a.com>';
      rcp2 = 'b@b.com';

      mail = {
        from: 'roberto@from.example.com',
        to: 'kingcnut@to.example.com',
        subject: 'Modern Kinging',
        text: 'Edicts and surfeits...',
        html: '<p>Edicts and surfeits...</p>'
      };

      sptrans.sparkPostEmailClient.transmissions.send = sinon.stub().yields({
        results: {
          total_rejected_recipients: 0,
          total_accepted_recipients: 1,
          id: '66123596945797072'
        }
      });
    });

    it('should accept basic nodemailer mail content fields', function(done) {
      transport.sendMail(mail, function() {
        const transBody = sptrans.sparkPostEmailClient.transmissions.send.firstCall.args[0];

        expect(transBody).to.have.keys(['recipients', 'content']);
        expect(transBody.content.html).to.equal(mail.html);
        expect(transBody.content.text).to.equal(mail.text);
        expect(transBody.content.subject).to.equal(mail.subject);
        expect(transBody.content.from).to.equal(mail.from);
        expect(transBody.recipients).to.have.length(1);
        expect(transBody.recipients[0]).to.have.keys('address');
        expect(transBody.recipients[0].address).to.be.a('string');
        expect(transBody.recipients[0].address).to.equal(mail.to);
        done();
      });
    });

    it('should accept raw mail structure', function(done) {
      delete mail.subject;
      delete mail.text;
      delete mail.html;
      delete mail.from;
      mail.raw = 'rawmsg';
      transport.sendMail(mail, function() {
        const transBody = sptrans.sparkPostEmailClient.transmissions.send.firstCall.args[0];

        expect(transBody).to.have.keys(['recipients', 'content']);
        expect(transBody.content).to.have.keys('email_rfc822');
        expect(transBody.recipients).to.have.length(1);
        expect(transBody.recipients[0]).to.have.keys('address');
        expect(transBody.recipients[0].address).to.be.a('string');
        expect(transBody.recipients[0].address).to.equal(mail.to);
        done();
      });
    });

    it('should accept from as a string', function(done) {
      mail.from = 'me@here.com';
      transport.sendMail(mail, function() {
        const trans = sptrans.sparkPostEmailClient.transmissions.send.firstCall.args[0];
        expect(trans.content.from).to.be.a('string');
        done();
      });
    });

    it('should accept from as an object', function(done) {
      mail.from = {
        name: 'Me',
        address: 'me@here.com'
      };

      transport.sendMail(mail, function() {
        const trans = sptrans.sparkPostEmailClient.transmissions.send.firstCall.args[0];
        expect(trans.content.from).to.be.an('object');
        expect(trans.content.from).to.have.property('name');
        expect(trans.content.from.name).to.equal(mail.from.name);
        expect(trans.content.from).to.have.property('email');
        expect(trans.content.from.email).to.equal(mail.from.address);
        done();
      });
    });

    it('should accept to as an array', function(done) {
      checkRecipientsFromFld(mail, 'to', [rcp1, rcp2], 'recipients', done);
    });

    it('should accept to as a string', function(done) {
      checkRecipientsFromFld(mail, 'to', [rcp1, rcp2].join(','), 'recipients', done);
    });

    it('should accept cc as an array', function(done) {
      checkRecipientsFromFld(mail, 'cc', [rcp1, rcp2], 'cc', done);
    });

    it('should accept cc as a string', function(done) {
      checkRecipientsFromFld(mail, 'cc', [rcp1, rcp2].join(','), 'cc', done);
    });

    it('should accept bcc as an array', function(done) {
      checkRecipientsFromFld(mail, 'bcc', [rcp1, rcp2], 'bcc', done);
    });

    it('should accept bcc as a string', function(done) {
      checkRecipientsFromFld(mail, 'bcc', [rcp1, rcp2].join(','), 'bcc', done);
    });
  });
});

