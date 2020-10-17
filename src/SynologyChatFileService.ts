import { SynoChatIncomingWebhookService } from './SynoChatService';
import { FileServerService } from './FileService';
import { SynologyChatMessage } from './SynologyChatMessage';


export class SynologyChatFileService {
	private fileService: FileServerService;
	private chatService: SynoChatIncomingWebhookService;

	constructor(
		port: number,
		baseUrl: string,
		incomingUrl: string,
		private verbose: boolean
	) {

		this.chatService = new SynoChatIncomingWebhookService(incomingUrl);
		this.fileService = new FileServerService(port, baseUrl, this.verbose);
	}

	async send(
		message: string | SynologyChatMessage
	) {

		if (typeof message === 'string' || message instanceof String) {
			message = {
				text: message as string
			};
		}

		if (message.buffer) {
			const url = this.fileService.serveBuffer(message.buffer, message.bufferExtension);
			this.log("Serving buffer under: " + url);
			message.fileUrl = url;
		}
		else if (message.filePath) {
			const url = this.fileService.serve(message.filePath);
			console.log("Serving file path under: " + url);
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
