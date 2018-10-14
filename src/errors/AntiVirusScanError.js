const {MoleculerError} = require("moleculer/src/errors");

/**
 * Error that should be thrown when an error is encountered during the scan
 *
 * @class AntiVirusScanError
 * @extends {MoleculerError}
 */
module.exports = class AntiVirusScanError extends MoleculerError {
	/**
	 * Creates an instance of AntiVirusScanError.
	 *
	 * @param {String?} message
	 * @param {Number?} code
	 * @param {String?} type
	 * @param {any} data
	 *
	 * @memberof AntiVirusScanError
	 */
	constructor(
		message = "AntiVirus encountered an error while scanning", code = 500,
		type = "ANTIVIRUS_SCAN_ERROR", data = {}) {
		super(message);
		this.code = code;
		this.type = type;
		this.data = data;
	}
};
