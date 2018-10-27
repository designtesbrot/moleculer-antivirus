const Service = require("service");
describe("Service", () => {
	describe("started", () => {
		it("creates a scanner instance and runs health checks by default", () => {
			let context = {
				Promise: require("bluebird"),
				settings: Service.settings,
				ping: jest.fn().mockReturnValue(Promise.resolve(true)),
				clamdVersion: jest.fn().mockReturnValue(Promise.resolve("ClamAV 1.2.3")),
				logger: {
					info: jest.fn()
				},
				metadata: {},
				createScanner: () => Object.assign({foo: "bar"})
			};
			return Service.started.bind(context)().then(() => {
				expect(context.metadata.healthCheckInterval.constructor.name).toEqual("Timeout");
			});
		});

		it("registers no health check if the interval is set to 0", () => {
			let context = {
				Promise: require("bluebird"),
				settings: Object.assign({}, Service.settings, {clamdHealthCheckInterval: 0}),
				ping: jest.fn().mockReturnValue(Promise.resolve(true)),
				clamdVersion: jest.fn().mockReturnValue(Promise.resolve("ClamAV 1.2.3")),
				logger: {
					info: jest.fn()
				},
				metadata: {},
				createScanner: () => Object.assign({foo: "bar"})
			};
			return Service.started.bind(context)().then(() => {
				expect(context.metadata.healthCheckInterval).toEqual(undefined);
			});
		});
	});
});
