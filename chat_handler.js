const { Data } = require("./dataModel");

async function responseHandler(userResponse, sendMessage, chatId) {
	let previousMessage = "";

	const messages = {
		location: "Where are you located?",
		peopleCount: "How many people are there?",
		gender: "What is the gender of person ",
		age: "What is the age of person ",
	};

	if (userResponse === "/start") {
		const data = await Data.findOne({ chat_id: chatId });

		if (data) {
			await sendMessage(chatId, "Welcome back!");

			// check what's missing and ask for it
			if (!data.location) {
				data.previousMessage = "location";
				await data.save();
				return await sendMessage(chatId, messages.location);
			}
			if (!data.numberOfPeople) {
				data.previousMessage = "peopleCount";
				await data.save();
				return await sendMessage(chatId, messages.peopleCount);
			}
			if (data.peopleData.length < data.numberOfPeople) {
				return;
			}

			return;
		}

		const newUser = new Data({
			chat_id: chatId,
			previousMessage: previousMessage,
		});

		await newUser.save();

		await sendMessage(
			chatId,
			"Welcome to the chatbot, please enter your location"
		);
		return;
	}

	const data = await Data.findOne({ chat_id: chatId });

	if (data.previousMessage === "location" || data.location === undefined) {
		data.location = userResponse;
		data.previousMessage = "peopleCount";
		await data.save();
		return await sendMessage(chatId, messages.peopleCount);
	}

	if (data.previousMessage === "peopleCount") {
		data.numberOfPeople = parseInt(userResponse);
		const message = messages.gender + `${data.activeIndex + 1}`;
		data.previousMessage = "gender";
		await data.save();
		return await sendMessage(chatId, message);
	}

	if (data.previousMessage === "gender") {
		data.peopleData[data.activeIndex] = {
			gender: userResponse,
			age: null,
		};
		data.previousMessage = "age";
		await data.save();
		const message = messages.age + `${data.activeIndex + 1}`;
		return await sendMessage(chatId, message);
	}

	if (data.previousMessage === "age") {
        //get age from user response
		data.peopleData[data.activeIndex].age = userResponse;
		const message = messages.gender + `${data.activeIndex + 1}`;
		const activeIndex = data.activeIndex + 1;
		data.activeIndex++;
		data.previousMessage =
			activeIndex === data.numberOfPeople ? "end" : "gender";
		await data.save();
		return await sendMessage(chatId, message);
	}

	if (data.previousMessage === "end") {
		return await sendMessage(chatId, "Thank you for your time!");
	}
}

module.exports = responseHandler;
