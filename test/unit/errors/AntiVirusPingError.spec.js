const {AntiVirusPingError} = require("errors");

describe("Errors", () => {
	describe("AntiVirusPingError", () => {
		describe("constructor", () => {
			it("constructs with sensitive defaults", () => {
				let error = new AntiVirusPingError();
				expect(error.message).toEqual("AntiVirus Backend not reachable");
				expect(error.code).toEqual(502);
				expect(error.type).toEqual("ANTIVIRUS_PING_ERROR");
				expect(error.data).toEqual({});
				expect(error.retryable).toEqual(true);
			});

			it("constructs with given arguments", () => {
				let error = new AntiVirusPingError("foo", 500, "BAR", {fooz: "barz"});
				expect(error.message).toEqual("foo");
				expect(error.code).toEqual(500);
				expect(error.type).toEqual("BAR");
				expect(error.data).toEqual({fooz: "barz"});
				expect(error.retryable).toEqual(true);
			});
		});
	});
});
