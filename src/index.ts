import { FileServerService } from './FileService';
import { SynologyChatFileService } from './SynologyChatFileService';
import { SynoChatIncomingWebhookService } from './SynoChatService';

function createSynologyChatFileService() {
	const port = <any>process.env.PORT || 8033;
	const baseUrl = process.env.FILE_SERVER_BASE_URL || "http://127.0.0.1";
	const incomingUrl = process.env.SYNOLOGY_CHAT_INCOMING_URL;
	const verbose = process.env.VERBOSE in ["1", "true", 1, true];

	return new SynologyChatFileService(port, baseUrl, incomingUrl, verbose);
}

export {
	SynoChatIncomingWebhookService,
	SynologyChatFileService,
	FileServerService
}
