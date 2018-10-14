const action = require("service").actions.scan;
describe("Service", () => {
	describe("actions", () => {
		describe("scan", () => {
			describe("params", () => {
				it("validates against a well defined schema", () => {
					expect(action.params).toEqual(
						[
							{type: "string"},
							{type: "object"},
						],
					);
				});
			});
			describe("handler", () => {
				it("resolves with the clamav scan of a file path", () => {
					let context = {
						scanFile: jest.fn().mockReturnValue(Promise.resolve(true)),
						Promise,
					};
					const params = "my/suspicios.exe";
					return action.handler.bind(context)({params}).
						then(result => {
							expect(context.scanFile.mock.calls[0]).
								toEqual([params]);
							expect(result).toEqual(true);
						});
				});

				it("rejects if an object made its way", () => {
					let context = {
						scanFile: jest.fn().mockReturnValue(Promise.resolve(true)),
						Promise,
					};
					const params = {foo: 'bar'};
					return action.handler.bind(context)({params}).
						catch(e => {
							expect(e.message).toEqual("Only paths or streams can be scanned");
							expect(e.constructor.name).toEqual("AntiVirusScanError");
						});
				});
			});
		});
	});
});
