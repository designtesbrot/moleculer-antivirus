const action = require("service").actions.scan;
const fs = require("fs");

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
						scan: jest.fn().mockReturnValue(Promise.resolve({signature: false})),
						size: jest.fn().mockReturnValue(Promise.resolve({size: 13})),
						mime: jest.fn().mockReturnValue(Promise.resolve({mimetype: "image/png", extension: "png"})),
						metadata: {
							transactionsCount: 1
						},
						Promise: require("bluebird"),
					};
					const params = __filename;
					return action.handler.bind(context)({params}).then(result => {
						expect(context.scan.mock.calls[0][0].constructor.name).toEqual("PassThrough");
						expect(context.size.mock.calls[0][0].constructor.name).toEqual("PassThrough");
						expect(context.mime.mock.calls[0][0].constructor.name).toEqual("PassThrough");
						expect(result).toEqual({signature: false, size: 13, mimetype: "image/png", extension: "png"});
						expect(context.metadata.transactionsCount).toEqual(1);
					});
				});

				it("resolves with the clamav scan of a remote file", () => {
					let context = {
						scan: jest.fn().mockReturnValue(Promise.resolve({signature: false})),
						size: jest.fn().mockReturnValue(Promise.resolve({size: 13})),
						mime: jest.fn().mockReturnValue(Promise.resolve({mimetype: "image/png", extension: "png"})),
						metadata: {
							transactionsCount: 1
						},
						Promise: require("bluebird"),
					};
					const params = {url: "http://www.eicar.org/download/eicar.com"};
					return action.handler.bind(context)({params}).then(result => {
						expect(context.scan.mock.calls[0][0].constructor.name).toEqual("PassThrough");
						expect(context.size.mock.calls[0][0].constructor.name).toEqual("PassThrough");
						expect(context.mime.mock.calls[0][0].constructor.name).toEqual("PassThrough");
						expect(result).toEqual({signature: false, size: 13, mimetype: "image/png", extension: "png"});
						expect(context.metadata.transactionsCount).toEqual(1);
					});
				});

				it("resolves with the clamav scan of a stream", () => {
					let context = {
						scan: jest.fn().mockReturnValue(Promise.resolve({signature: false})),
						size: jest.fn().mockReturnValue(Promise.resolve({size: 13})),
						mime: jest.fn().mockReturnValue(Promise.resolve({mimetype: "image/png", extension: "png"})),
						metadata: {
							transactionsCount: 1
						},
						Promise: require("bluebird"),
					};
					const params = fs.createReadStream(__filename);
					return action.handler.bind(context)({params}).then(result => {
						expect(context.scan.mock.calls[0][0].constructor.name).toEqual("PassThrough");
						expect(context.size.mock.calls[0][0].constructor.name).toEqual("PassThrough");
						expect(context.mime.mock.calls[0][0].constructor.name).toEqual("PassThrough");
						expect(result).toEqual({signature: false, size: 13, mimetype: "image/png", extension: "png"});
						expect(context.metadata.transactionsCount).toEqual(1);
					});
				});

				it("rejects if the params are neither an object, stream nor file", () => {
					let context = {
						scan: jest.fn().mockReturnValue(Promise.resolve(true)),
						metadata: {
							transactionsCount: 1
						},
						Promise: require("bluebird"),
					};
					return action.handler.bind(context)({params: NaN}).catch(e => {
						expect(e.constructor.name).toEqual("AntiVirusScanError");
						expect(e.message).toEqual("Only paths or streams can be scanned");
						expect(context.metadata.transactionsCount).toEqual(1);
					});
				});
			});
		});
	});
});
