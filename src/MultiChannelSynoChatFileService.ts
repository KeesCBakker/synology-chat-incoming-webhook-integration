import { SynoChatIncomingWebhookService } from "./api/SynoChatService";
import { FileServerService } from "./hosting/FileServerService";
import { SynoChatMessage } from "./api/SynoChatMessage";

/**
 * Creats a chat service for a single channel.
 */
export class Channel {
	public chatService: SynoChatIncomingWebhookService;

	/**
	 * 
	 * @param name The name of the channel (just for lookup, does not have to be the real name).
	 * @param incomingUrl The incoming webhook from Synology Chat.
	 */
	constructor(public name: string, incomingUrl: string) {
		this.chatService = new SynoChatIncomingWebhookService(incomingUrl);
	}
}

/**
 * Service for sending chats to Synology with (local) files.
 *
 * @export
 * @class SynoChatFileService
 */
export class MultiChannelSynoChatFileService {
	private fileService: FileServerService;

	/**
	 * 
	 * @param fileServiceWebServerPort The port of the web service of the file service. Example: 3000.
	 * @param fileServiceWebServerUrl The baseUrl of the file service. Example: http://127.0.0.1:3000.
	 * @param channels A list of channels that can be used to message to.
	 * @param {boolean} verbose True if verbose; otherwise false.
	 */
	constructor(
		fileServiceWebServerPort: number,
		fileServiceWebServerUrl: string,
		public channels: Channel[],
		private verbose: boolean
	) {
		this.fileService = new FileServerService(fileServiceWebServerPort, fileServiceWebServerUrl, this.verbose);
	}

	/**
	 * Sends a message to the Synology Chat.
	 *
	 * @param {(string | SynoChatMessage)} message The message.
	 *
	 * @memberOf SynoChatFileService
	 */
	async send(channelName: string, message: string | SynoChatMessage) {
		const channel = this.channels.find((x) => x.name == channelName);
		if (!channel) {
			throw "Unknown channe: " + channelName;
		}

		if (typeof message === "string" || message instanceof String) {
			message = {
				text: message as string,
			};
		}

		if (message.buffer) {
			const url = await this.fileService.serveBuffer(
				message.buffer,
				message.bufferExtension
			);
			message.fileUrl = url;
		} else if (message.filePath) {
			const url = await this.fileService.serve(message.filePath);
			message.fileUrl = url;
		}

		if (message.fileUrl) {
			await channel.chatService.send(message.text, message.fileUrl);
		} else if (message.text) {
			await channel.chatService.send(message.text);
		} else {
			throw new Error(
				"Cannot send an empty message. Please specify text or file."
			);
		}
	}

	private log(text: string) {
		if (this.verbose) {
			console.log(text);
		}
	}
}
