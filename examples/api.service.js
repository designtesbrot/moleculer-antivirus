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
	metadata: {
		transactionsCount: 0
	},
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
						this.metadata.transactionsCount += 1;
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
								}).finally(() => {
									this.metadata.transactionsCount -= 1;
								});
						});

						form.on("error", e => {
							this.logger.error('upload error', e);
							this.metadata.transactionsCount -= 1;
						});

						form.parse(req);

					},

				},
				mappingPolicy: "restrict",
			},
		],
	},
});

process.once('SIGUSR2', function () {
	broker.stop().then(() => {
		process.kill(process.pid, 'SIGUSR2');
	});
});

// Start server
broker.start().then(() => broker.repl());
