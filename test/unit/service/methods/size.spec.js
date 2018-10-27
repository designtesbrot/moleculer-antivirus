const fs = require("fs");
const {PassThrough} = require("stream");
const method = require("service").methods.size;

describe("Service", () => {
	describe("methods", () => {
		describe("size", () => {
			it("resolves with an object containing the size in bytes", () => {
				const stream = fs.createReadStream(__dirname + "/../../../test.png");
				return method(stream.pipe(new PassThrough())).then(r => {
					expect(r).toEqual({size: 10418});
				});
			});

			it("rejects with an AntiVirusSizeError", () => {
				const stream = {
					on: jest.fn()
				};
				const p = method(stream);
				stream.on.mock.calls[2][1](new Error("Something went wrong"));

				return p.catch(e => {
					expect(e.message).toEqual("Something went wrong");
					expect(e.constructor.name).toEqual("AntiVirusSizeError");
				});
			});
		});
	});
});
