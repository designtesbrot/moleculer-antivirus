
"use strict";

const {ServiceBroker} = require("moleculer");
const AntiVirusService = require("./..");

// Create broker
let broker = new ServiceBroker({
	logger: console,
	transporter: 'nats://nats:4222'
});

// Load services
broker.createService({mixins: AntiVirusService});

// Start server
broker.start().then(() => broker.repl());
