const method = require("service").methods.ping;
describe("Service", () => {
	describe("methods", () => {
		describe("ping", () => {
			it("uses the service settings as defaults for connecting to the backend", () => {
				const pingMock = jest.fn().mockReturnValueOnce(Promise.resolve({foo: "bar"}));
				const context = {
					settings: {
						clamdPort: 1234,
						clamdHost: "1.2.3.4",
						clamdTimeout: 333
					},
					Promise: {
						promisify: jest.fn().mockReturnValueOnce(pingMock)
					},
				};
				return method.bind(context)().then(r => {
					expect(r).toEqual({foo: "bar"});
					expect(context.Promise.promisify.mock.calls[0]).toEqual([require("clamav.js").ping,{context: require("clamav.js")}]);
					expect(pingMock.mock.calls[0]).toEqual([
						context.settings.clamdPort,
						context.settings.clamdHost,
						context.settings.clamdTimeout,
					]);
				});
			});

			it("uses given arguments instead of service settings for connecting to the backend", () => {
				const pingMock = jest.fn().mockReturnValueOnce(Promise.resolve({foo: "bar"}));
				const context = {
					settings: {
						clamdPort: 1234,
						clamdHost: "1.2.3.4",
						clamdTimeout: 333
					},
					Promise: {
						promisify: jest.fn().mockReturnValueOnce(pingMock)
					},
				};
				const opts = {
					port: 1235,
					host: "1.2.3.5",
					timeout: 334
				};
				return method.bind(context)(opts).then(r => {
					expect(r).toEqual({foo: "bar"});
					expect(context.Promise.promisify.mock.calls[0]).toEqual([require("clamav.js").ping,{context: require("clamav.js")}]);
					expect(pingMock.mock.calls[0]).toEqual([
						opts.port,
						opts.host,
						opts.timeout,
					]);
				});
			});

			it("rejects with an AntiVirusPingError if the backend did not respond", () => {
				const pingMock = jest.fn().mockReturnValueOnce(Promise.reject(new Error("Something went wrong")));
				const context = {
					settings: {
						clamdPort: 1234,
						clamdHost: "1.2.3.4",
						clamdTimeout: 333
					},
					Promise: {
						promisify: jest.fn().mockReturnValueOnce(pingMock)
					},
				};
				return method.bind(context)().catch(e => {
					expect(e.constructor.name).toEqual("AntiVirusPingError");
					expect(e.message).toEqual("Something went wrong");
				});
			});
		});
	});
});
