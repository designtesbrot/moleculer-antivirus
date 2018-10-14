const {MoleculerError} = require("moleculer/src/errors");

/**
 * Error that should be thrown when the AntiVirus Service can not be Initialized
 *
 * @class AntiVirusInitializationError
 * @extends {MoleculerError}
 */
module.exports = class AntiVirusInitializationError extends MoleculerError {
	/**
	 * Creates an instance of AntiVirusInitializationError.
	 *
	 * @param {String?} message
	 * @param {Number?} code
	 * @param {String?} type
	 * @param {any} data
	 *
	 * @memberof AntiVirusInitializationError
	 */
	constructor(
		message = "AntiVirus can not be initialized", code = 500,
		type = "ANTIVIRUS_INITIALIZATION_ERROR", data = {}) {
		super(message);
		this.code = code;
		this.type = type;
		this.data = data;
	}
};
