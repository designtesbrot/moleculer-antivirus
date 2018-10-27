const fs = require("fs");
const method = require("service").methods.mime;

describe("Service", () => {
	describe("methods", () => {
		describe("mime", () => {
			it("resolves with an object containing the extension and the mime type", () => {
				const stream = {
					once: jest.fn(),
					on: jest.fn()
				};
				const chunk = fs.readFileSync(__dirname + "/../../../test.png");
				const p = method(stream);
				expect(stream.once.mock.calls[0][0]).toEqual("data");
				expect(stream.on.mock.calls[0][0]).toEqual("error");
				stream.once.mock.calls[0][1](chunk);

				return p.then(r => {
					expect(r).toEqual({ext: "png", mime: "image/png"});
				});
			});

			it("rejects with an AntiVirusMimeError", () => {
				const stream = {
					once: jest.fn(),
					on: jest.fn()
				};
				const p = method(stream);
				stream.on.mock.calls[0][1](new Error("Something went wrong"));

				return p.catch(e => {
					expect(e.message).toEqual("Something went wrong");
					expect(e.constructor.name).toEqual("AntiVirusMimeError");
				});
			});
		});
	});
});
