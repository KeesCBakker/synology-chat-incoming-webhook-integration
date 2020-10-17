import { networkInterfaces } from 'os';
const nets = networkInterfaces();
const addresses = new Array<string>();

for (const name of Object.keys(nets)) {
	for (const net of nets[name]) {
		// skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
		if (net.family === 'IPv4' && !net.internal) {
			addresses.push(net.address);
		}
	}
}

function firstIpWith(prefix: string) {
	const matches = addresses.filter(x => x.startsWith(prefix));
	if (matches.length) return matches[0];
	return null;
}

export function getIp() {
	return firstIpWith("192.") ||
		firstIpWith("10.") ||
		firstIpWith("172.") ||
		firstIpWith("") ||
		"127.0.0.1";
}
