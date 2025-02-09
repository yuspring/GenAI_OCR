const OpenAI = require("openai");
const fs = require("fs/promises");
require("dotenv").config();

const openai = new OpenAI({
	apiKey: process.env.GEMINI_API_KEY,
	baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

const text = "請依照以下步驟來完成辨識菜單文字的任務\n" +
	"1.請列點菜單上有哪些種類的產品?\n" +
	"格式如下:\n" +
	"1、蛋餅\n" +
	"2、點心\n" +
	"2.依照列出的菜單上的產品，輸出品項的名字及價格\n" +
	"格式如下:\n" +
	"1、蛋餅\n" +
	"原味蛋餅 30元";

async function encodeImage(imagePath) {
  try {
    const imageBuffer = await fs.readFile(imagePath);
	
	return imageBuffer.toString('base64');
	} catch (error) {
	console.error("Error encoding image:", error);
	return null;
	}
}

async function main() {
	const base64Image = await encodeImage("./image.jpg");

	const messages = [+
	{
		"role": "system",
		"content": "請使用繁體中文，並辨別餐廳菜單上的文字"
	},
	{
		"role": "user",
		"content": [
		{
			"type": "text",
    		"text": text
		},
		{
			"type": "image_url",
			"image_url": {
				"url": `data:image/jpeg;base64,${base64Image}`
			}
		}
		]
	}
	];

	try {
	const response = await openai.chat.completions.create({
		model: "gemini-2.0-pro-exp-02-05",
		messages: messages,
		temperature:0,
		max_tokens:1000,
	});

	console.log(response.choices[0]);
	} catch (error) {
		console.error("Error calling Gemini API:", error);
	}
}

main();
