import { FileServerService } from './FileService';
import { SynologyChatFileService } from './SynologyChatFileService';
import { SynoChatIncomingWebhookService } from './SynoChatService';

export function createSynologyChatFileService() {
	const port = <any>process.env.PORT || 8033;
	const baseUrl = process.env.FILE_SERVER_BASE_URL || "http://127.0.0.1:" + port;
	const incomingUrl = process.env.SYNOLOGY_CHAT_INCOMING_URL;

	let verbose = true;

	if (process.env.VERBOSE) {
		if (process.env.VERBOSE in ["1", "true", "TRUE"]) {
			verbose = true;
		}
		else if (process.env.VERBOSE in ["0", "false", "FALSE"]) {
			verbose = false;
		}
	}

	return new SynologyChatFileService(port, baseUrl, incomingUrl, verbose);
}

export {
	SynoChatIncomingWebhookService,
	SynologyChatFileService,
	FileServerService
}
