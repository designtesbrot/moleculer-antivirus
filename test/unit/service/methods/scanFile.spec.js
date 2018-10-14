const method = require('service').methods.scanFile;
describe('Service', () => {
	describe('methods', () => {
		describe('scanFile', () => {
			it('rejects if there is a runtime error in the scanner', () => {
				let context = {
					scanner: {
						is_infected: () => {throw new Error("Runtime Error in the Scanner")},
					},
					Promise,
				};
				return method.bind(context)().
					catch(e => {
						expect(e.constructor.name).toEqual("AntiVirusScanError");
						expect(e.message).toEqual("Runtime Error in the Scanner");
					});
			});

			it('rejects if clam(d)scan encountered an error', () => {
				let context = {
					scanner: {
						is_infected: (path, fn) => {fn(new Error("Runtime Error in ClamAV"), path)},
					},
					Promise,
				};
				return method.bind(context)().
					catch(e => {
						expect(e.constructor.name).toEqual("AntiVirusScanError");
						expect(e.message).toEqual("Runtime Error in ClamAV");
					});
			});

			it('resolves with the infection status', () => {
				let context = {
					scanner: {
						is_infected: (path, fn) => {fn(undefined, path, true)},
					},
					Promise,
				};
				const file = 'suspicios.exe';
				return method.bind(context)(file).
					then(result => {
						expect(result).toEqual({
							file,
							infected: true,
						});
					});
			});
		});
	});
});
