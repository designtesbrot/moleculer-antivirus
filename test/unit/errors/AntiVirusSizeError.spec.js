const {AntiVirusSizeError} = require("errors");

describe("Errors", () => {
	describe("AntiVirusSizeError", () => {
		describe("constructor", () => {
			it("constructs with sensitive defaults", () => {
				let error = new AntiVirusSizeError();
				expect(error.message).toEqual("AntiVirus encountered an error while detecting the size");
				expect(error.code).toEqual(500);
				expect(error.type).toEqual("ANTIVIRUS_SIZE_ERROR");
				expect(error.data).toEqual({});
				expect(error.retryable).toEqual(false);
			});

			it("constructs with given arguments", () => {
				let error = new AntiVirusSizeError("foo", 500, "BAR",
					{fooz: "barz"});
				expect(error.message).toEqual("foo");
				expect(error.code).toEqual(500);
				expect(error.type).toEqual("BAR");
				expect(error.data).toEqual({fooz: "barz"});
				expect(error.retryable).toEqual(false);
			});
		});
	});
});
