const express = require("express");

const { fetcher } = require("../fetcher.js");

let result = [];
let retryLinks = [];
const app = express();
app.use(express.json());
const port = 3000;
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
app.post("/parse", async (req, res) => {
	await loop(req.body.domainName).then(() => {
		retry().then(() => res.send(result));
	});
});
app.get("/", function (req, res) {
	res.send("hello world");
});

//регулярка для подстроки вида "<a href='https://test.com/'>"
const linkRx = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g;
async function loop(domainName) {
	let links = [domainName];
	for (let i = 0; i < links.length; i++) {
		await fetcher(links[i]).then((response) => {
			if (response.status == 200) {
				//если статус 200 - добавляем ссылку в result
				result.push(links[i]);
				response.text().then((text) => {
					if (text.match(linkRx) !== null) {
						text.match(linkRx).forEach((link) => {
							let linkWithoutTag = link.slice(9, link.length - 1);
							if (!links.includes(linkWithoutTag)) {
								//если на текущей стрнаице есть ссылка, которой еще нет в массиве links, то добавляем ее в массив
								links.push(linkWithoutTag);
							}
						});
					}
				});
			}
			if (response.status == 500) {
				console.log("500");
				retryLinks.push(links[i]);
			}
		});
	}
}

async function retry() {
	console.log(retryLinks);
	for (let i = 0; i < retryLinks.length; i++) {
		await fetcher(retryLinks[i]).then((response) => {
			if (response.status == 200) {
				//если статус 200 - добавляем ссылку в result
				result.push(retryLinks[i]);
				response
					.text()
					.then((text) => {
						if (text.match(linkRx) !== null) {
							text.match(linkRx).forEach((link) => {
								let linkWithoutTag = link.slice(
									9,
									link.length - 1
								);
								if (!retryLinks.includes(linkWithoutTag)) {
									//если на текущей стрнаице есть ссылка, которой еще нет в массиве retryLinks, то добавляем ее в массив
									retryLinks.push(linkWithoutTag);
								}
							});
						}
					})
					.then(() => console.log(result));
			}
		});
	}
}
