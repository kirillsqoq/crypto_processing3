const express = require("express");

const app = express();
app.use(express.json());
const port = 3000;
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
app.post("/callback", async (req, res) => {
	console.log("сработал кал бэк");
		logObjectFields(req.body);

});
app.get("/", function (req, res) {
	res.send("hello world");
});
function logObjectFields(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      console.log(`${key}: ${obj[key]}`);
    }
  }
}

// Пример использования функции

