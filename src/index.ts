import { FileServerService } from "./hosting/FileServerService";
import { getIp } from "./hosting/ip";
import { SynoChatFileService } from "./SynoChatFileService";
import { SynoChatIncomingWebhookService } from "./api/SynoChatService";
import { MultiChannelSynoChatFileService, Channel } from "./MultiChannelSynoChatFileService";

/**
 * Creates a new Synology Chat File Service.
 *
 * @export
 * @param {(string | null)} [syonologyChatIncomingUrg=null] The incoming URL for Synology chat. Default is env SCIWI_SYNOLOGY_CHAT_INCOMING_URL.
 * @param {(number | null)} [fileServerPort=null] The port for the file server. Default is env SCIWI_FILE_SERVER_PORT or 8033.
 * @param {(string | null)} [fileServerBaseUrl=null] The base URL for the file server. Default is SCIWI_FILE_SERVER_BASE_URL or http://{ip}:port/.
 * @param {(boolean | null)} [verbose=null] True if verbose. Default SCIWI_VERBOSE.
 * @returns The Synology Chat File Service.
 */
export function createSynoChatFileService(
	syonologyChatIncomingUrg: string | null = null,
	fileServerPort: number | null = null,
	fileServerBaseUrl: string | null = null,
	verbose: boolean | null = null
) {
	fileServerPort =
		fileServerPort || <any>process.env.SCIWI_FILE_SERVER_PORT || 8033;

	fileServerBaseUrl =
		fileServerBaseUrl ||
		process.env.SCIWI_FILE_SERVER_BASE_URL ||
		`http://${getIp()}:${fileServerPort}`;

	syonologyChatIncomingUrg =
		syonologyChatIncomingUrg || process.env.SCIWI_SYNOLOGY_CHAT_INCOMING_URL;

	if (verbose == null) {
		verbose = true;

		if (process.env.SCIWI_VERBOSE) {
			if (process.env.SCIWI_VERBOSE in ["1", "true", "TRUE"]) {
				verbose = true;
			} else if (process.env.SCIWI_VERBOSE in ["0", "false", "FALSE"]) {
				verbose = false;
			}
		}
	}

	return new SynoChatFileService(
		fileServerPort,
		fileServerBaseUrl,
		syonologyChatIncomingUrg,
		verbose
	);
}

export {
	SynoChatIncomingWebhookService,
	SynoChatFileService as SynologyChatFileService,
	SynoChatFileService,
	FileServerService,
	MultiChannelSynoChatFileService,
	Channel,
	getIp
};
