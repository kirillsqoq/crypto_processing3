const express = require("express");
const crypto = require("crypto");
const { MongoClient } = require("mongodb");

async function getOrdersCollection() {
	const client = new MongoClient(
		"mongodb+srv://kirill:130798Ski@clustertg.nne7ey8.mongodb.net/?retryWrites=true&w=majority"
	);
	try {
		await client.connect();
		const db = client.db("tgbot");
		const orders = db.collection("orders");
		return orders;
	} catch (err) {
		console.log(err);
	}
}
//

const secretKey =
	"O-WI_EZeXz6IfkPbThcQ6IHEllvh-8ZvVcKbYgyaOIdcjH1Z1p9IQdaoChRJU_gX";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/callback", async (req, res) => {
	const data = req.body;
	console.log(data);
	console.log(validateRequest(data));	
	if (data && validateRequest(data)) {
	console.log('валидировано');
		//если сработал калбэк, то надо изменить статус соотвествующего инвойса в базе данных
		const ordersCollection = await getOrdersCollection();
		console.log(data.status);
		ordersCollection.updateOne(
			{ txn_id: data.txn },
			{ $set: { status: data.status } }
		);
		res.status(200).json({ message: "This is a correct JSON callback" });
	} else {
		res.status(422).json({ error: "Incorrect data" });
	}
});

function validateRequest(data) {
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
}

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
