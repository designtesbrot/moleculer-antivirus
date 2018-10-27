const Service = require("service");
describe("Service", () => {
	describe("created", () => {
		it("creates a scanner instance", () => {
			let context = {
				settings: Service.settings,
				createScanner: () => Object.assign({foo: "bar"})
			};
			Service.created.bind(context)();
			expect(context.scanner).toEqual({foo: "bar"});
		});
	});
});
