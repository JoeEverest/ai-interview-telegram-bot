require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const responseHandler = require("./chat_handler");
const { default: mongoose } = require("mongoose");

const { PORT, BOT_TOKEN, SERVER_URL, MONGODB_ACCESS_URL } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const URI = `/webhook/${BOT_TOKEN}`;
const WEBHOOK_URL = `${SERVER_URL}${URI}`;

const app = express();
app.use(cors());
app.use(bodyParser.json());

async function init() {
	try {
		const res = await axios.get(
			`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`
		);
		console.log(res.data);
	} catch (error) {
		console.log(error);
	}
}

const sendMessage = async (chatId, text) => {
	await axios.post(`${TELEGRAM_API}/sendMessage`, {
		chat_id: chatId,
		text,
	});
};

app.get("/", (req, res) => {
	res.send("It works!");
})

app.post(URI, async (req, res) => {
	const { message } = req.body;
	const chatId = message.chat.id;
	const text = message.text;

	// await responseHandler(text, sendMessage, chatId);
	console.log('====================================');
	console.log(chatId, text);
	console.log('====================================');

	res.status(200).end();
});

mongoose.connect(MONGODB_ACCESS_URL);

app.listen(PORT, async () => {
	console.log(`Server is running on port ${PORT}`);
	await init();
});
