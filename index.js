const express = require("express");
const app = express();
app.use(express.json());
const port = 3000;
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
app.post("/callback", async (req, res) => {
	console.log("callback requset");
	console.log(req.body);
	res.setHeader("Content-Type", "application/json");
	res.json({ message: "Success in JSON format" });
});
app.get("/", function (req, res) {
	res.send("hello");
});
