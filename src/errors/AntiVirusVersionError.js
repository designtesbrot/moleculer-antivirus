const {MoleculerRetryableError} = require("moleculer/src/errors");

/**
 * Error that should be thrown when the version of the AntiVirus Backend can not be acquired
 *
 * @class AntiVirusVersionError
 * @extends {MoleculerRetryableError}
 */
module.exports = class AntiVirusVersionError extends MoleculerRetryableError {
	/**
	 * Creates an instance of AntiVirusVersionError.
	 *
	 * @param {String?} message
	 * @param {Number?} code
	 * @param {String?} type
	 * @param {any} data
	 *
	 * @memberof AntiVirusVersionError
	 */
	constructor(
		message = "AntiVirus Backend version can not be acquired", code = 502,
		type = "ANTIVIRUS_VERSION_ERROR", data = {}) {
		super(message);
		this.code = code;
		this.type = type;
		this.data = data;
	}
};
