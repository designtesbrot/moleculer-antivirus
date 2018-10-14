const Service = require("service");
describe("Service", () => {
	describe("created", () => {
		it("creates a vault instance", () => {
			let context = {
				settings: Service.settings
			};
			Service.created.bind(context)();
			expect(context.scanner.constructor.name).toEqual("NodeClam");
		});
	});
});
