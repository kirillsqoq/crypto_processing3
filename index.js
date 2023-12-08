const http = require("http");
const crypto = require("crypto");
const secretKey =
	"O-WI_EZeXz6IfkPbThcQ6IHEllvh-8ZvVcKbYgyaOIdcjH1Z1p9IQdaoChRJU_gX";

const host = "127.0.0.1";
const port = 8000;

const vallidateRequest = function (data) {
	if (typeof data === "object" && data.verify_hash && secretKey) {
		const ordered = { ...data };
		delete ordered.verify_hash;
		const string = JSON.stringify(ordered);
		const hmac = crypto.createHmac("sha1", secretKey);
		hmac.update(string);
		const hash = hmac.digest("hex");
		return hash === data.verify_hash;
	}
	return false;
};

const requestListener = function (req, res) {
	let chunks = "";
	req.on("data", (chunk) => (chunks += chunk));
	req.on("end", () => {
		let data;
		try {
			data = JSON.parse(chunks);
			console.log(data);
			res.setHeader("Content-Type", "application/json");
		} catch (e) {
			// console.error(e);
			data = false;
		}

		if (data && vallidateRequest(data)) {
			res.writeHead(200);
			res.end("This is a correct JSON callback");
		} else {
			res.writeHead(422);
			res.end("Incorrect data 1");
		}
	});
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
	console.log(`Server is running on http://${host}:${port}`);
});
