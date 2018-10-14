const Service = require("service");
describe("Service", () => {
	describe("settings", () => {
		it("uses sensitive defaults", () => {
			expect(Service.settings).toEqual({
				temporaryStorage: "/tmp",
				scan_log: null,
				debug_mode: false,
				clamscan: {
					path: '/usr/bin/clamscan',
					db: null,
					scan_archives: true,
					active: true,
				},
				clamdscan: {
					path: '/usr/bin/clamdscan',
					config_file: '/etc/clamd.conf',
					multiscan: true,
					reload_db: false,
					active: true,
				},
				preference: 'clamdscan',
			});
		});
	});
});
