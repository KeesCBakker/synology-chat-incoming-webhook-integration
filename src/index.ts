import { FileServerService } from './FileServerService';
import { SynoChatFileService } from './SynoChatFileService';
import { SynoChatIncomingWebhookService } from './SynoChatService';
import { getIp } from "./ip"

export function createSynoChatFileService() {
	const port = <any>process.env.SCIWI_FILE_SERVER_PORT || 8033;
	const baseUrl = process.env.SCIWI_FILE_SERVER_BASE_URL || `http://${getIp()}:${port}`;
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

	return new SynoChatFileService(port, baseUrl, incomingUrl, verbose);
}

export {
	SynoChatIncomingWebhookService,
	SynoChatFileService as SynologyChatFileService,
	FileServerService
}
