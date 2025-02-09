const OpenAI = require("openai");
const fs = require("fs/promises");
require("dotenv").config();

const openai = new OpenAI({
	apiKey: process.env.GEMINI_API_KEY,
	baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

const text = "這張圖片是什麼"; 

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
	const imagePath = "./image.jpg";
	const base64Image = await encodeImage(imagePath);

	const messages = [
	{
		"role": "system",
		"content": "請使用繁體中文對話,並辨別餐廳菜單上的文字"
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
	});

	console.log(response.choices[0]);
	} catch (error) {
		console.error("Error calling Gemini API:", error);
	}
}

main();
