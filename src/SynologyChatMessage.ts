/**
 * Chat message for Synology Chat.
 *
 * @interface SynologyChatMessage
 */
export interface SynologyChatMessage {
	/**
	 * The text message. When sending a file, it is optional.
	 *
	 * @type {string} The text.
	 * @memberOf SynologyChatMessage
	 */
	text?: string;

	/**
	 * A file in the form of a buffer.
	 *
	 * @type {Buffer} The buffer.
	 * @memberOf SynologyChatMessage
	 */
	buffer?: Buffer;

	/**
	 * When a buffer is send, this extension is added to the
	 * file name.
	 *
	 * @type {string} The extension.
	 * @memberOf SynologyChatMessage
	 */
	bufferExtension?: string;

	/**
	 * The local file path of the file to send.
	 *
	 * @type {string} The local file path.
	 * @memberOf SynologyChatMessage
	 */
	filePath?: string;

	/**
	 * The file url to send.
	 *
	 * @type {string} URL of the file, should be accessible by Synology.
	 * @memberOf SynologyChatMessage
	 */
	fileUrl?: string;
}
