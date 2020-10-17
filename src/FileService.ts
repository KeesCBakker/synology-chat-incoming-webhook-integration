import express from 'express';
import fs from 'fs';
import path from 'path';
import tmp from 'tmp';
import { v4 } from 'uuid';
import helmet from 'helmet'

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
		private readonly baseUrl: string) {
	}

	/**
	 * Starts the file server. Will generate a new temporary directory to
	 * store new files in.
	 *
	 * @returns {void}
	 *
	 * @memberOf FileServerService
	 */
	start(): void {

		if (this.isStarted) return;

		this.isStarted = true;
		this.directory = tmp.dirSync();

		this.app = express()
		this.app.use(helmet());
		this.app.use(express.static(this.directory.name))
		this.app.listen(this.port, () => { });
	}

	private createRandomFileName(ext: string) {

		let fullPath: string, fileName: string;

		do {
			fileName = v4().replace("-", "");
			fileName = Buffer.from(fileName, 'hex').toString('base64')
			fileName = fileName.replace(/[+/=]/g, "--");
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
	serve(filePath: string) {
		this.start();

		const ext = path.extname(filePath);
		const rnd = this.createRandomFileName(ext);
		fs.copyFileSync(filePath, rnd.fullPath);

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
	serveBuffer(buffer: Buffer, extension: string) {

		if (!extension) {
			extension = "";
		}
		else if (!extension.startsWith(".")) {
			extension = "." + extension;
		}

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
}
