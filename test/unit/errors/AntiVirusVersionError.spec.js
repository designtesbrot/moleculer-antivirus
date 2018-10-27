const {AntiVirusVersionError} = require("errors");

describe("Errors", () => {
	describe("AntiVirusVersionError", () => {
		describe("constructor", () => {
			it("constructs with sensitive defaults", () => {
				let error = new AntiVirusVersionError();
				expect(error.message).toEqual("AntiVirus Backend version can not be acquired");
				expect(error.code).toEqual(502);
				expect(error.type).toEqual("ANTIVIRUS_VERSION_ERROR");
				expect(error.data).toEqual({});
				expect(error.retryable).toEqual(true);
			});

			it("constructs with given arguments", () => {
				let error = new AntiVirusVersionError("foo", 500, "BAR", {fooz: "barz"});
				expect(error.message).toEqual("foo");
				expect(error.code).toEqual(500);
				expect(error.type).toEqual("BAR");
				expect(error.data).toEqual({fooz: "barz"});
				expect(error.retryable).toEqual(true);
			});
		});
	});
});
