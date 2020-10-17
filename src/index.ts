import { FileServerService } from './FileService';
import { SynologyChatFileService } from './SynologyChatFileService';
import { SynoChatIncomingWebhookService } from './SynoChatService';

export function createSynologyChatFileService() {
	const port = <any>process.env.SCIWI_FILE_SERVER_PORT || 8033;
	const baseUrl = process.env.SCIWI_FILE_SERVER_BASE_URL || "http://127.0.0.1:" + port;
	const incomingUrl = process.env.SCIWI_SYNOLOGY_CHAT_INCOMING_URL;

	let verbose = true;

	if (process.env.SCIWI_VERBOSE) {
		if (process.env.SCIWI_VERBOSE in ["1", "true", "TRUE"]) {
			verbose = true;
		}
		else if (process.env.SCIWI_VERBOSE in ["0", "false", "FALSE"]) {
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
