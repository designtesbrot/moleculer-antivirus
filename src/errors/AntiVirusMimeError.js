const {MoleculerError} = require("moleculer/src/errors");

/**
 * Error that should be thrown when an error is encountered during detecting the mime type
 *
 * @class AntiVirusMimeError
 * @extends {MoleculerError}
 */
module.exports = class AntiVirusMimeError extends MoleculerError {
	/**
	 * Creates an instance of AntiVirusMimeError.
	 *
	 * @param {String?} message
	 * @param {Number?} code
	 * @param {String?} type
	 * @param {any} data
	 *
	 * @memberof AntiVirusMimeError
	 */
	constructor(
		message = "AntiVirus encountered an error while detecting the mimetype", code = 500,
		type = "ANTIVIRUS_MIME_ERROR", data = {}) {
		super(message);
		this.code = code;
		this.type = type;
		this.data = data;
	}
};
