const {MoleculerError} = require("moleculer/src/errors");

/**
 * Error that should be thrown when an error is encountered during detecting the size
 *
 * @class AntiVirusSizeError
 * @extends {MoleculerError}
 */
module.exports = class AntiVirusSizeError extends MoleculerError {
	/**
	 * Creates an instance of AntiVirusSizeError.
	 *
	 * @param {String?} message
	 * @param {Number?} code
	 * @param {String?} type
	 * @param {any} data
	 *
	 * @memberof AntiVirusSizeError
	 */
	constructor(
		message = "AntiVirus encountered an error while detecting the size", code = 500,
		type = "ANTIVIRUS_SIZE_ERROR", data = {}) {
		super(message);
		this.code = code;
		this.type = type;
		this.data = data;
	}
};
