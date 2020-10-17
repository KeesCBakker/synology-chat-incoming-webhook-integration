import fetch from 'node-fetch'

const INCOMING_URL_REGEX = /https?:\/\/.*?\/webapi\/entry\.cgi\?api=SYNO\.Chat\.External&method=incoming&version=2&token=%22.*%22/

/**
 * Service that interacts with Synology Chat using the
 * incoming webhook integration.
 *
 * @export
 * @class SynoChatIncomingWebhookService
 */
export class SynoChatIncomingWebhookService {

	/**
	 * Creates an instance of SynoChatIncomingWebhookService.
	 * @param {string} incomingUrl The URL of the incoming webhook integration.
	 *
	 * @memberOf SynoChatIncomingWebhookService
	 */
	constructor(private incomingUrl: string) {

		if (!INCOMING_URL_REGEX.test(incomingUrl)) {
			throw new Error(`Invalid incoming url, it should have this patern:
{http or https}://{url or ip}/webapi/entry.cgi?api=SYNO.Chat.External&method=incoming&version=2&token=%22{your-token}%22,
`)
		}
	}

	/**
	 * Sends a message to the Synology Chat.
	 *
	 * @param {string} text The text.
	 * @param {(string|null)} [fileUrl=null] The file URL. The URL needs to be accessible by Synology Chat.
	 *
	 * @memberOf SynoChatIncomingWebhookService
	 */
	async send(text: string, fileUrl: string | null = null) {

		const data = {
			"text": text,
		} as any;

		if (fileUrl) {
			data.file_url = fileUrl;
		}

		const response = await fetch(this.incomingUrl, {
			method: 'post',
			body: new URLSearchParams([
				['payload', JSON.stringify(data)]
			]),
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		});

		const answer = await response.json();
		if (answer.error) {

			let msg = "Error while comunicating with Synology Chat.";
			msg += "\n" + JSON.stringify(answer.error)

			if (answer.error.code == 117 && fileUrl && fileUrl.startsWith("http://127.0.0.1")) {
				msg = "\nHint: when running locally make sure you use the IP of your computer in the SCIWI_FILE_SERVER_BASE_URL.";
			}

			throw new Error(msg);
		}

	}
}
