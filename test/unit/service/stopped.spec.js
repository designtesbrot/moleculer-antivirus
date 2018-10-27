const Service = require("service");
describe("Service", () => {
	describe("stopped", () => {
		it("clears the health check interval if it exists", () => {
			let healthCheckInterval = setInterval(() => {},1000);
			let context = {
				metadata: {
					healthCheckInterval
				}
			};
			Service.stopped.bind(context)();
			expect(context.metadata.healthCheckInterval._idleNext).toEqual(null);
		});

		it("does not clear the health check interval if none defined", () => {
			let context = {
				metadata: {
					healthCheckInterval: undefined
				}
			};
			Service.stopped.bind(context)();
			expect(context.metadata.healthCheckInterval).toEqual(undefined);
		});
	});
});
