const {MoleculerRetryableError} = require("moleculer/src/errors");

/**
 * Error that should be thrown when the AntiVirus Backend can not be pinged
 *
 * @class AntiVirusPingError
 * @extends {MoleculerRetryableError}
 */
module.exports = class AntiVirusPingError extends MoleculerRetryableError {
	/**
	 * Creates an instance of AntiVirusPingError.
	 *
	 * @param {String?} message
	 * @param {Number?} code
	 * @param {String?} type
	 * @param {any} data
	 *
	 * @memberof AntiVirusPingError
	 */
	constructor(
		message = "AntiVirus Backend not reachable", code = 502,
		type = "ANTIVIRUS_PING_ERROR", data = {}) {
		super(message);
		this.code = code;
		this.type = type;
		this.data = data;
	}
};
