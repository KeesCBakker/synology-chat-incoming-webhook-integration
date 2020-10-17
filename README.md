# Synology Chat Incoming Webhook integration

This package helps with sending files to your Synology Chat. It uses the _incoming webhook integration_. This integration will provide you with an URL that allows the program to interact with a _single_ channel. To upload local files, the package will open up a webserver that will server the files from a temporary directory under a random file name.


## Usage

The easy way:

```js
const { createSynoChatFileService } = 'synology-chat-imcoming-webhook-integration'
const chat = createSynoChatFileService();

// text
await chat.send("Sending a test message");

// local file
await chat.send({
	text: "Sending a test file",
	filePath: "c:\\temp\\my-file.txt"
});

// remote file
await chat.send({
	text: "Sending a file url",
	fileUrl: ""
});

// memory buffer
let buffer = Buffer.from("Hello world!", 'utf-8');
await chat.send({
	text: "Seding a buffer",
	buffer: buffer,
	bufferExtension: ".txt"
});
```

It will get the configuration from your environment variables or infer them:

| Variable                           | Default  | Notes                                 |
| ---------------------------------- | -------- | ------------------------------------- |
| `SCIWI_FILE_SERVER_PORT`           | 8033     |                                       |
| `SCIWI_FILE_SERVER_BASE_URL`       | local ip | tries to scan your network interfaces |
| `SCIWI_SYNOLOGY_CHAT_INCOMING_URL` |          | see token section                     |

## Advanced
Create and configure you own service:
```js
const { SynoChatFileService } = 'synology-chat-imcoming-webhook-integration'
const chat = new SynoChatFileService(
	8033,
	"http://192.168.1.13:8033",
	"{http or https}://{url or ip}/webapi/entry.cgi?api=SYNO.Chat.External&method=incoming&version=2&token=%22{your-token}%22"
)
```
Or don't use the file server:
```js
const { SynoChatService } = 'synology-chat-imcoming-webhook-integration'
const chat = new SynoChatService(
	"{http or https}://{url or ip}/webapi/entry.cgi?api=SYNO.Chat.External&method=incoming&version=2&token=%22{your-token}%22"
)
```

## How to get an incoming webhook
To the following:
- Open up the DSM of your Synology NAS
- Open the _Main Menu_ and click on _Synology Chat_
- Click on your user icon in the top right corner.
- Click on _Integration_
- Click on _Incoming Webhooks_
- Click on the _Create_ button
- Finish the dialog and copy the _Webhook URL_
- Add this URL as `SCIWI_SYNOLOGY_CHAT_INCOMING_URL` environment variable to your application.

## Local File Server
When sending a local file or a memory buffer, the following happens:

- When a local file or buffer is send to the chat, an express web server is started. It serves static files from a new temporary directory.
- The local file or buffer is copied to a new file in the temporary directory with a random file name.
- The URL is send to Synology. Synology will download the file from the web server.
- When the server is stopped, the directory will be deleted as well.


