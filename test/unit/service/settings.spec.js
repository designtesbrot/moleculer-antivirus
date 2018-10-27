const Service = require("service");
describe("Service", () => {
	describe("settings", () => {
		it("uses sensitive defaults", () => {
			expect(Service.settings).toEqual({
				clamdPort: 3310,
				clamdHost: "127.0.0.1",
				clamdTimeout: 1000,
				clamdHealthCheckInterval: 5000,
			});
		});
	});
});
