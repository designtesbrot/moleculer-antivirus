const Clamscan = require("clamscan");
const fs = require("fs");
const Promise = require("bluebird");
const {isString} = require("ramda-adjunct");
const uuid = require("uuid/v4");
const {AntiVirusInitializationError, AntiVirusScanError} = require("./errors");
const {isReadableStream} = require("./helpers");
/**
 * Service mixin for scanning files with clamav
 *
 * @name moleculer-antivirus
 * @module Service
 */
module.exports = {
	// Service name
	name: "antivirus",

	// Default settings
	settings: {
		/** @type {String?} In case you pass a redable stream, we have to store the stream somewhere. This path is to location of this storage. */
		temporaryStorage: "/tmp",
		/** @type {String?} Path to a writeable log file to write scan results into */
		scan_log: null,
		/** @type {Boolean?} Whether or not to log info/debug/error msgs to the console */
		debug_mode: false,
		/** @type {Object?} clamdcan configuration */
		clamscan: {
			/** @type {String?} Path to the clamscan binary */
			path: "/usr/bin/clamscan",
			/** @type {String?} Path to a custom virus definition database */
			db: null,
			/** @type {Boolean?} If true, scan archives (ex. zip, rar, tar, dmg, iso, etc...) */
			scan_archives: true,
			/** @type {Boolean?} If true, this service will consider using the clamscan binary */
			active: true,
		},
		/** @type {Object?} clamdscan configuration */
		clamdscan: {
			/** @type {String?} Path to the clamdscan binary */
			path: "/usr/bin/clamdscan",
			/** @type {String?} Path to the clamdscan configuration */
			config_file: "/etc/clamd.conf",
			/** @type {Boolean?} Scan using all available cores! Yay! */
			multiscan: true,
			/** @type {Boolean?} If true, will re-load the DB on every call (slow) */
			reload_db: false,
			/** @type {Boolean?} If true, this service will consider using the clamdscan binary */
			active: true,
		},
		/** @type {String?} Which scan client to prefer (clamdscan or clamscan) */
		preference: "clamdscan",
	},

	methods: {
		/**
		 * Scan a file for a virus
		 *
		 * @methods
		 *
		 * @param {String} path - The stream or file to scan
		 * @returns {Promise.<AntiVirusScanError|{file: {String}, infected:
		 *         {Boolean}}>}
		 */
		scanFile(path) {
			return new this.Promise((res, rej) => {
				try {
					this.scanner.is_infected(path, (err, file, is_infected) => {
						if (err) {
							rej(new AntiVirusScanError(err.message));
						}
						else {
							res({
								file,
								infected: is_infected,
							});
						}
					});
				}
				catch (e) {
					rej(new AntiVirusScanError(e.message));
				}
			});
		},
		/**
		 * Persists a stream to the file system before scanning it (clamav has
		 * no interface for nodejs streams) The location can be configured via
		 * the `temporaryStorage` setting. In case of clamdscan being used, it
		 * is your responsiblility that the temporary storage location is
		 * available to the clamd host. Check the examples folder, where docker
		 * mounts are used.
		 *
		 * @methods
		 *
		 * @param {ReadableStream} data - the stream to persist
		 *
		 * @returns {PromiseLike<String|AntiVirusScanError>} resolved promise
		 *         contains the path of the file.
		 */
		persistStream(data) {
			return this.Promise.resolve(data).
				then(stream => {
					const streamTo = `${this.settings.temporaryStorage}/${uuid()}`;
					return new this.Promise((res, rej) => {
						stream.pipe(fs.createWriteStream(streamTo)).
							on("finish", () => res(streamTo)).
							on("error",
								e => rej(new AntiVirusScanError(e.message)));
					});

				});
		},
	},

	/**
	 * Interact with the Vault
	 */
	actions: {
		/**
		 * Scans a given file or stream
		 *
		 * @actions
		 *
		 * @param {String|ReadableStream} the file to scan, can be a path or a
		 *         stream
		 *
		 * @returns {Object} The Scan result.
		 */
		scan: {
			params: [
				{type: "string"},
				{type: "object"},
			],
			handler(ctx) {
				return this.Promise.resolve(ctx.params).
					// ensure that streams are writting to the temporary folder
					then(subject => isReadableStream(subject)
						? this.persistStream(subject)
						: subject).
					// scan the file if it is a string
					then(subject => {
						if (isString(subject)) {
							return this.scanFile(subject);
						}
						else {
							throw new AntiVirusScanError(
								"Only paths or streams can be scanned");
						}
					});
			},
		},
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {
		try {
			this.scanner = Clamscan(this.settings);
		}
		catch (e) {
			throw new AntiVirusInitializationError(e.message);
		}
	},
};
