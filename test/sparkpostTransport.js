"use strict";

var sinon = require("sinon");
var expect = require("chai").expect;

var nodemailer = require('nodemailer');
var sparkPostTransport = require("../lib/sparkPostTransport.js");

var pkg = require("../package.json");

describe("SparkPost Transport", function() {
  var transport = sparkPostTransport({sparkPostApiKey: "12345678901234567890"});

  it("should have a name and version property", function(done) {
    expect(transport).to.have.property("name", "SparkPost");
    expect(transport).to.have.property("version", pkg.version);
    done();
  });

  it("should expose a send method", function(done) {
    expect(transport.send).to.exist;
    expect(transport.send).to.be.a("function");
    done();
  });

  it("should be able to set options", function(done) {
    var transport = sparkPostTransport({
      sparkPostApiKey: "12345678901234567890",
      campaign_id: "sample_campaign",
      tags: ["new-account-notification"],
      metadata: {"source": "event"},
      substitution_data: {"salutatory": "Welcome to SparkPost!"},
      options: {"click_tracking": true, "open_tracking": true},
      content: {"template_id": "newAccountNotification"},
      recipients: [{"email": "john.doe@example.com", "name": "John Doe"}]
    });

    expect(transport.campaign_id).to.equal("sample_campaign");
    expect(transport.tags).to.deep.equal(["new-account-notification"]);
    expect(transport.metadata).to.deep.equal({"source": "event"});
    expect(transport.substitution_data).to.deep.equal({"salutatory": "Welcome to SparkPost!"});
    expect(transport.options).to.deep.equal({"click_tracking": true, "open_tracking": true});
    expect(transport.content).to.deep.equal({"template_id": "newAccountNotification"});
    expect(transport.recipients).to.deep.equal([{"email": "john.doe@example.com", "name": "John Doe"}]);

    done();
  });

});

describe("Send Method", function() {

  describe('SP-centric mail structure', function() {
    it("should be able to overload options at the transmission", function(done) {
      // Create the default transport
      var transport = sparkPostTransport({
        sparkPostApiKey: "12345678901234567890",
        campaign_id: "sample_campaign",
        tags: ["new-account-notification"],
        metadata: {"source": "event"},
        substitution_data: {"salutatory": "Welcome to SparkPost!"},
        options: {"click_tracking": true, "open_tracking": true},
        content: {"template_id": "newAccountNotification"},
        recipients: [{"email": "john.doe@example.com", "name": "John Doe"}]
      });

      // Stub the send method of the SDK out
      sinon.stub(transport, "send", function(data, resolve) {
        // Grab the transmissionBody from the send() payload for assertions
        expect(data.campaign_id).to.equal("another_sample_campaign");
        expect(data.tags).to.deep.equal(["alternative-tag"]);
        expect(data.metadata).to.deep.equal({"changedKey": "value"});
        expect(data.substitution_data).to.deep.equal({"salutatory": "And now...for something completely different"});
        expect(data.options).to.deep.equal({"click_tracking": false, "open_tracking": false, "transactional": true});
        expect(data.content).to.deep.equal({"template_id": "someOtherTemplate"});
        expect(data.recipients).to.deep.equal([{"list_id": "myStoredRecipientTestList"}]);

        // Resolve the stub's spy
        resolve({
          results: {
            total_rejected_recipients: 0,
            total_accepted_recipients: 1,
            id: "66123596945797072"
          }
        });
      });

      // Create the modified options for use with the above stub test
      var overloadedTransmission = {
        campaign_id: "another_sample_campaign",
        tags: ["alternative-tag"],
        metadata: {"changedKey": "value"},
        substitution_data: {"salutatory": "And now...for something completely different"},
        options: {"click_tracking": false, "open_tracking": false, "transactional": true},
        recipients: [{
          list_id: "myStoredRecipientTestList"
        }],
        content: {
          template_id: "someOtherTemplate"
        }
      };

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
    var sptrans
      , transport
      , mail
      , rcp1
      , rcp2;

    function checkTo(done) {
      var req = sptrans.sparkPostEmailClient.transmissions.send.firstCall.args[0]
        , transBody = req.transmissionBody;

      expect(req).to.have.keys('transmissionBody');
      expect(transBody).to.have.keys(['recipients', 'content']);
      expect(transBody.recipients).to.have.length(2);
      expect(transBody.recipients[0]).to.deep.equal({ address: rcp1 });
      expect(transBody.recipients[1]).to.deep.equal({ address: rcp2 });
      done();
    }

    beforeEach(function() {
      sptrans = sparkPostTransport({
        sparkPostApiKey: "12345678901234567890"
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
          id: "66123596945797072"
        }
      });
    });

    it('should accept basic nodemailer mail content fields', function(done) {
      transport.sendMail(mail, function(result) {
        var req = sptrans.sparkPostEmailClient.transmissions.send.firstCall.args[0]
          , transBody = req.transmissionBody;

        expect(req).to.have.keys('transmissionBody');
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
      transport.sendMail(mail, function(result) {
        var req = sptrans.sparkPostEmailClient.transmissions.send.firstCall.args[0]
          , transBody = req.transmissionBody;

        expect(req).to.have.keys('transmissionBody');
        expect(transBody).to.have.keys(['recipients', 'content']);
        expect(transBody.content).to.have.keys('email_rfc822');
        expect(transBody.recipients).to.have.length(1);
        expect(transBody.recipients[0]).to.have.keys('address');
        expect(transBody.recipients[0].address).to.be.a('string');
        expect(transBody.recipients[0].address).to.equal(mail.to);
        done();
      });
    });

    it('should accept to as an array', function(done) {
      mail.to = [rcp1, rcp2];
      transport.sendMail(mail, function(result) {
        checkTo(done);
      });
    });

    it('should accept to as a string', function(done) {
      mail.to = [rcp1, rcp2].join(',');
      transport.sendMail(mail, function(result) {
        checkTo(done);
      });
    });
  });
});

