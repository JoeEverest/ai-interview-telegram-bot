const { default: mongoose } = require("mongoose");

const dataSchema = mongoose.Schema({
	chat_id: {
		type: String,
		required: true,
	},
	location: {
		type: String,
		required: false,
	},
	numberOfPeople: {
		type: Number,
		required: false,
	},
	peopleData: [
		{
			gender: {
				type: String,
				required: false,
			},
			age: {
				type: Number,
				required: false,
			},
		},
	],
	previousMessage: {
		type: String,
		required: false,
	},
	activeIndex: {
		type: Number,
		required: true,
		default: 0,
	},
});

const Data = mongoose.model("Data", dataSchema);

module.exports = { Data };
