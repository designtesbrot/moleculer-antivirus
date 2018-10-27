const method = require("service").methods.createScanner;
describe("Service", () => {
	describe("methods", () => {
		describe("createScanner", () => {
			it("uses the service settings as defaults for creating the scanner", () => {
				const context = {
					settings: {
						clamdPort: 1234,
						clamdHost: "1.2.3.4"
					}
				};
				let scanner = method.bind(context)();
				expect(scanner.host).toEqual(context.settings.clamdHost);
				expect(scanner.port).toEqual(context.settings.clamdPort);
				expect(scanner.scan.constructor.name).toEqual("Function");
			});

			it("uses the given arguments instead of the service settings for creating the scanner", () => {
				const context = {
					settings: {
						clamdPort: 1234,
						clamdHost: "1.2.3.4"
					}
				};
				const opts = {port: 125, host: "1.2.3.5"};
				let scanner = method.bind(context)(opts);
				expect(scanner.host).toEqual(opts.host);
				expect(scanner.port).toEqual(opts.port);
				expect(scanner.scan.constructor.name).toEqual("Function");
			});
		});
	});
});
