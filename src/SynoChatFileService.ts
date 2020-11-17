import { SynoChatIncomingWebhookService } from './api/SynoChatService';
import { FileServerService } from './hosting/FileServerService';
import { SynoChatMessage } from './api/SynoChatMessage';

/**
 * Service for sending chats to Synology with (local) files.
 *
 * @export
 * @class SynoChatFileService
 */
export class SynoChatFileService {
	private fileService: FileServerService;
	private chatService: SynoChatIncomingWebhookService;

	/**
	 * Creates an instance of SynoChatFileService.
	 * @param {number} port The port.
	 * @param {string} baseUrl The base URL that is used to call this service externally.
	 * @param {string} incomingUrl The incoming webhook from Synology Chat.
	 * @param {boolean} verbose True if verbose; otherwise false.
	 *
	 * @memberOf SynoChatFileService
	 */
	constructor(
		port: number,
		baseUrl: string,
		incomingUrl: string,
		private verbose: boolean
	) {

		this.chatService = new SynoChatIncomingWebhookService(incomingUrl);
		this.fileService = new FileServerService(port, baseUrl, this.verbose);
	}

	/**
	 * Sends a message to the Synology Chat.
	 *
	 * @param {(string | SynoChatMessage)} message The message.
	 *
	 * @memberOf SynoChatFileService
	 */
	async send(
		message: string | SynoChatMessage
	) {

		if (typeof message === 'string' || message instanceof String) {
			message = {
				text: message as string
			};
		}

		if (message.buffer) {
			const url = await this.fileService.serveBuffer(message.buffer, message.bufferExtension);
			message.fileUrl = url;
		}
		else if (message.filePath) {
			const url = await this.fileService.serve(message.filePath);
			message.fileUrl = url;
		}

		if (message.fileUrl) {
			await this.chatService.send(message.text, message.fileUrl);
		}
		else if (message.text) {
			await this.chatService.send(message.text);
		}
		else {
			throw new Error("Cannot send an empty message. Please specify text or file.");
		}
	}

	private log(text: string) {
		if (this.verbose) {
			console.log(text);
		}
	}
}
