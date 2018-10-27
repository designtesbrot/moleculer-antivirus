const Service = require("service");
describe("Service", () => {
	describe("metadata", () => {
		it("uses a sensitive default", () => {
			expect(Service.metadata).toEqual({
				transactionsCount: 0,
			});
		});
	});
});
