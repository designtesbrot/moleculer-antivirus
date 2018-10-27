const method = require("service").methods.scan;
describe("Service", () => {
	describe("methods", () => {
		describe("scan", () => {
			it("resolves with an object containing the signature if a signature was detected", () => {
				const context = {
					scanner: {scan: jest.fn()},
					Promise,
				};
				const stream = {fooz: "barz"};
				const p = method.bind(context)(stream);
				context.scanner.scan.mock.calls[0][1](undefined,{foo: "bar"}, "SuperWeirdExe");
				return p.then(r => {
					expect(r).toEqual({signature: "SuperWeirdExe"});
					expect(context.scanner.scan.mock.calls[0][0]).toEqual(stream);
				});
			});

			it("rejects with an AntiVirusScanError if an error was encountered during scanning the stream", () => {
				const context = {
					scanner: {scan: jest.fn()},
					Promise,
				};
				const p = method.bind(context)();
				context.scanner.scan.mock.calls[0][1](new Error("Something went wrong"),undefined, undefined);
				return p.catch(e => {
					expect(e.constructor.name).toEqual("AntiVirusScanError");
					expect(e.message).toEqual("Something went wrong");
				});
			});
		});
	});
});
