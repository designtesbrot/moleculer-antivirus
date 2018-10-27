const fs = require("fs");
const {PassThrough} = require("stream");
const {defaultTo, clone, omit, prop, mergeAll} = require("ramda");
const {isString, isPlainObj} = require("ramda-adjunct");
const fetch = require("node-fetch");
const fileType = require("file-type");
const {
	AntiVirusInitializationError,
	AntiVirusScanError,
	AntiVirusPingError,
	AntiVirusVersionError,
	AntiVirusMimeError,
	AntiVirusSizeError
} = require("./errors");
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
		/** @type {Number?} The port that clamd is listening on */
		clamdPort: 3310,
		/** @type {String?} The ip that clamd is listening on */
		clamdHost: "127.0.0.1",
		/** @type {Number?} The timeout when communicating with clamd for pinging and acquireing the clamd version */
		clamdTimeout: 1000,
		/** @type {Number?} This service will perform a periodic healthcheck of clamd. Use this setting to configure the inverval in which the healthcheck is performed. Set to `0` to turn healthcheks of */
		clamdHealthCheckInterval: 5000,
	},

	metadata: {
		/** @type {Number} The number of scans that are currently ongoing */
		transactionsCount: 0,
	},

	methods: {
		/**
		 * Pings the configured clamd backend
		 *
		 * @methods
		 *
		 * @param {Number} port - The port clamd is listening on. Defaults to `settings.clamdPort`
		 * @param {string} host - The host clamd is listening on. Defaults to `settings.clamdHost`
		 * @param {Number} timeout - The timeout for this operation. Defaults to `settings.clamdTimeout`
		 *
		 * @returns {PromiseLike<undefined|AntiVirusPingError>}
		 */
		ping({port, host, timeout} = {}) {
			return (this.Promise.promisify(require("clamav.js").ping, {context: require("clamav.js")}))(
				defaultTo(this.settings.clamdPort, port),
				defaultTo(this.settings.clamdHost, host),
				defaultTo(this.settings.clamdTimeout, timeout)
			).catch(e => {throw new AntiVirusPingError(e.message);});
		},
		/**
		 * Acquires the version of the configured clamd backend
		 *
		 * @methods
		 *
		 * @param {Number} port - The port clamd is listening on. Defaults to `settings.clamdPort`
		 * @param {string} host - The host clamd is listening on. Defaults to `settings.clamdHost`
		 * @param {Number} timeout - The timeout for this operation. Defaults to `settings.clamdTimeout`
		 *
		 * @returns {PromiseLike<String|AntiVirusVersionError>}
		 */
		clamdVersion({port, host, timeout} = {}) {
			return (this.Promise.promisify(require("clamav.js").version, {context: require("clamav.js")}))(
				defaultTo(this.settings.clamdPort, port),
				defaultTo(this.settings.clamdHost, host),
				defaultTo(this.settings.clamdTimeout, timeout)
			).catch(e => {throw new AntiVirusVersionError(e.message);});
		},
		/**
		 * Creates and returns a new clamd scanner
		 *
		 * @methods
		 *
		 * @param {Number} port - The port clamd is listening on. Defaults to `settings.clamdPort`
		 * @param {string} host - The host clamd is listening on. Defaults to `settings.clamdHost`
		 * @returns {{port, host, scan}}
		 */
		createScanner({port, host} = {}) {
			return require("clamav.js").createScanner(
				defaultTo(this.settings.clamdPort, port),
				defaultTo(this.settings.clamdHost, host)
			);
		},
		/**
		 * Scan a stream for malicious content. Resolves with an object. If a virus signature was found in the
		 * stream, the `signature` property of the resolve object contains the name of the signature found.
		 * If the property is not undefined, you should consider the scanned stream malicious.
		 * This method rejects when an error was encountered during the scan, not when the scan found a signature!
		 *
		 * @methods
		 *
		 * @param {ReadableStream} stream
		 * @returns {PromiseLike<{signature: String|undefined}|AntiVirusScanError>}
		 */
		scan(stream) {
			return new this.Promise((res, rej) => {
				this.scanner.scan(stream, (err, obj, signature) => {
					if (err) {
						rej(err);
					} else {
						res(clone({signature}));
					}
				});
			}).
				catch(e => {
					throw new AntiVirusScanError(e.message);
				});
		},
		/**
		 * Obtain the mime type of a stream
		 *
		 * @methods
		 *
		 * @param {ReadableStream} stream
		 * @returns {PromiseLike<{ext: String, mime: String}|AntiVirusMimeError>}
		 */
		mime(stream) {
			return new this.Promise((res, rej) => {
				stream.once("data", chunk => {
					res(defaultTo({}, fileType(chunk)));
				});
				stream.on("error", e => rej(new AntiVirusMimeError(e.message)));
			});
		},
		/**
		 * Obtain the size of a stream in bytes
		 *
		 * @methods
		 *
		 * @param {ReadableStream} stream
		 * @returns {PromiseLike<{size: Number}|AntiVirusSizeError>}
		 */
		size(stream) {
			return new this.Promise((res, rej) => {
				let size = 0;
				stream.on("data", chunk => size += chunk.length);
				stream.on("finish", () => res({size}));
				stream.on("error", e => rej(new AntiVirusSizeError(e.message)));
			});
		}
	},

	/**
	 * Interact with the Clamd Backend
	 */
	actions: {
		/**
		 * Scans a given file or stream.
		 * Not that this action does not reject, if a virus signature was detected! It will only reject if an error was
		 * encoutered during the scan. If a signature was found (and the file therefore is malicious) the resolved
		 * object of this action will contain the signature.
		 *
		 * @actions
		 *
		 * @param {String|ReadableStream|{url: {string}}} the file to scan, can be a path, a stream or an object. If a
		 *         **path** is given, this action will try to acquire a readable stream for the path. If an **object**
		 *         is given, a http(s) stream will be acquired and the response body will be scanned. For the location
		 *         of the request, the url property will be used, while all other properties will be used as
		 *         [node-fetch-options](https://www.npmjs.com/package/node-fetch#fetch-options)
		 *
		 * @returns {PromiseLike<{signature: String|undefined, size: Number|undefined, mime: String|undefined, ext:
		 *         String|undefined}|AntiVirusScanError>}
		 */
		scan: {
			params: [
				{type: "string"},
				{type: "object"},
			],
			handler(ctx) {
				// increment the transaction counter
				this.metadata.transactionsCount += 1;
				return this.Promise.resolve(ctx.params).
					// if a plain object is given, create a ReadStream using node-fetch
					then(subject => isPlainObj(subject)
						? fetch(subject.url, omit(["url"], subject)).then(prop("body"))
						: subject).
					// if a string is given, create a ReadStream for the file at the strings location
					then(subject => isString(subject) ? fs.createReadStream(subject) : subject).
					// scan the stream
					then(subject => {
						if (isReadableStream(subject)) {
							return Promise.all([
								this.mime(subject.pipe(new PassThrough())),
								this.scan(subject.pipe(new PassThrough())),
								this.size(subject.pipe(new PassThrough()))
							]);
						} else {
							throw new AntiVirusScanError("Only paths or streams can be scanned");
						}
					}).then(mergeAll)
					// decrement the transaction counter
					.finally(() => this.metadata.transactionsCount -= 1);
			},
		},
	},

	/**
	 * Service created lifecycle event handler.
	 * Constructs a new scanner entity
	 */
	created() {
		this.scanner = this.createScanner();
	},
	/**
	 * Service started lifecycle event handler. Resolves when:
	 * * ping and version acquisition of clamd backend has been successful
	 * * a healthCheck has been registered, given clamdHealthCheckInterval > 0
	 * @returns {PromiseLike<undefined|AntiVirusInitializationError>}
	 */
	started() {
		/* istanbul ignore next */
		return this.Promise.resolve().
			then(() =>
				this.ping().then(() =>
					this.clamdVersion()
				)
			).
			then(version => this.logger.info("Connected to clamd ", version)).
			then(() => {
				this.settings.clamdHealthCheckInterval ?
					this.metadata.healthCheckInterval = setInterval(
						() => this.ping().catch(e => this.logger.error("Clamd backend can not be reached", e)),
						this.settings.clamdHealthCheckInterval)
					: undefined;
				return undefined;
			}).
			catch(e => {
				throw new AntiVirusInitializationError(e.message);
			});
	},
	/**
	 * Service stopped lifecycle event handler.
	 * Removes the healthCheckInterval
	 */
	stopped() {
		this.metadata.healthCheckInterval && clearInterval(this.metadata.healthCheckInterval);
	},

};
