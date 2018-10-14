"use strict";

const multiparty = require("multiparty");
const nodeRes = require("node-res");
const {ServiceBroker} = require("moleculer");
const ApiGatewayService = require("moleculer-web");

// Create broker
let broker = new ServiceBroker({
	logger: console,
	transporter: "nats://nats:4222",
});

// Load services
broker.createService({
	mixins: ApiGatewayService,
	settings: {
		routes: [
			{
				path: "/upload",
				bodyParsers: {
					json: false,
					urlencoded: false,
				},
				aliases: {
					"POST /"(req, res) {
						const form = new multiparty.Form();
						form.on("part", part => {

							return this.broker.call("antivirus.scan", part).
								then(result => {
									this.logger.info("File scanned", result);
									nodeRes.send(req, res, result);
								}).
								catch(err => {
									this.logger.error("File scan error!", err);
									this.sendError(req, res, err);
								});
						});

						form.parse(req);
					},

				},
				mappingPolicy: "restrict",
			},
		],
	},
});

// Start server
broker.start().then(() => broker.repl());
