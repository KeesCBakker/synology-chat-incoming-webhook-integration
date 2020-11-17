import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import path from 'path';
import tmp from 'tmp';
import { v4 } from 'uuid';

/**
 * The file server will host files in a temporary directory. When it is
 * shut donw, the files will be cleared as well. It uses Express as its
 * web server. The served files are copied to the temporary directory
 * and served with random file names.
 *
 * @export
 * @class FileServerService
 */
export class FileServerService {

	isStarted: boolean;
	directory: tmp.DirResult;
	app: any;

	/**
	 * Creates an instance of FileServerService.
	 * @param {number} port The port on which the server should be started.
	 * @param {string} baseUrl The URL on which the files will be returned.
	 *
	 * @memberOf FileServerService
	 */
	constructor(
		private readonly port: number,
		private readonly baseUrl: string,
		private readonly verbose: boolean) {
	}

	/**
	 * Starts the file server. Will generate a new temporary directory to
	 * store new files in.
	 *
	 * @returns {void}
	 *
	 * @memberOf FileServerService
	 */
	start(): Promise<void> {

		if (this.isStarted) return;

		this.isStarted = true;
		this.directory = tmp.dirSync();

		this.app = express()
		this.app.use(helmet());

		if (this.verbose) {
			this.app.use((req, _, next) => {
				var filename = path.basename(req.url);
				this.log(`The file ${filename} was requested.`);
				next();
			});
		}
		this.app.use(express.static(this.directory.name))

		return new Promise<void>(resolve => {
			this.app.listen(this.port, () => {
				this.log("Express server started on port " + this.port);
				resolve();
			});
		});
	}

	private createRandomFileName(ext: string) {

		let fullPath: string, fileName: string;

		do {
			fileName = v4().replace("-", "");
			fileName = Buffer.from(fileName, 'hex').toString('base64')
			fileName = fileName.replace(/\=]/g, "---");
			fileName = fileName.replace(/\//g, "--");
			fileName = fileName.replace(/\+/g, "-");
			fileName += ext;
			fullPath = path.join(this.directory.name, fileName);
		}
		while (fs.existsSync(fullPath));

		return {
			fileName,
			fullPath,
			url: `${this.baseUrl}/${fileName}`
		};
	}

	/**
	 * Serves the file path. It does so by copying the file to a temporary
	 * directory. It will return the URL on which it is served. Note: when
	 * the services is stopped, the copied file will be removed.
	 *
	 * @param {string} filePath The file path.
	 * @returns The URL on which the file is served.
	 *
	 * @memberOf FileServerService
	 */
	async serve(filePath: string) {
		await this.start();

		const ext = path.extname(filePath);
		const rnd = this.createRandomFileName(ext);

		fs.copyFileSync(filePath, rnd.fullPath);
		this.log(`Serving new file on: ${rnd.url}`);

		return rnd.url;
	}

	/**
	 * Will write the buffer to a file in a temporary directory. It will
	 * return the URL on which it is served. Note: when the services is
	 * stopped, the created file will be removed.
	 *
	 * @param {Buffer} buffer The buffer.
	 * @param {string} extension The extension of the file.
	 * @returns The URL on which the file is served.
	 *
	 * @memberOf FileServerService
	 */
	async serveBuffer(buffer: Buffer, extension: string) {

		if (!extension) {
			extension = "";
		}
		else if (!extension.startsWith(".")) {
			extension = "." + extension;
		}

		await this.start();

		const rnd = this.createRandomFileName(extension);
		const f = fs.openSync(rnd.fullPath, "w");
		fs.writeSync(f, buffer);
		fs.closeSync(f);


		return rnd.url;
	}

	/**
	 * Stops the file server and destroys the temporary directory.
	 *
	 * @memberOf FileServerService
	 */
	stop() {
		this.directory.removeCallback();
		this.directory = null;
		this.app.close();
		this.isStarted = false;
	}


	private log(text: string) {
		if (this.verbose) {
			console.log(text);
		}
	}
}
