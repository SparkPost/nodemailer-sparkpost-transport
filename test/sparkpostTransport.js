"use strict";

var sinon = require("sinon");
var expect = require("chai").expect;

var sparkpostTransport = require("../");

var pkg = require("../package.json");

describe("SparkPost Transport Tests", function() {
  var transport = sparkpostTransport();

  it("should have a name and version property", function(done) {
    expect(transport).to.have.property("name", "Sparkpost");
    expect(transport).to.have.property("version", pkg.version);
    done();
  });

  it("should expose a send method", function(done) {
    expect(transport.send).to.exist;
    expect(transport.send).to.be.a("function");
    done();
  });

  it("should be able to set options", function(done) {
    var transport = sparkpostTransport({
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

  it("should be able to overload options at the transmission", function(done) {
    // Create the default transport
    var transport = sparkpostTransport({
      campaign_id: "sample_campaign",
      tags: ["new-account-notification"],
      metadata: {"source": "event"},
      substitution_data: {"salutatory": "Welcome to SparkPost!"},
      options: {"click_tracking": true, "open_tracking": true},
      content: {"template_id": "newAccountNotification"},
      recipients: [{"email": "john.doe@example.com", "name": "John Doe"}]
    });

    // Stub the send method of the SDK out
    var stub = sinon.stub(transport, "send", function(data, resolve) {
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
