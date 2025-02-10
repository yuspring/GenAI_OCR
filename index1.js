const OpenAI = require("openai");
const fs = require("fs/promises");
require("dotenv").config();

const openai = new OpenAI({
	apiKey: process.env.GEMINI_API_KEY,
	baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

const text = `
請依照以下步驟來完成辨識菜單文字的任務
1. 辨識菜單上有哪些種類的產品
2. 依照列出的菜單上的產品，辨識品項的名字及價格
3. 依照以上內容輸出json格式
格式如下:
{
  "類別": "蛋餅",
  "商品": [
    {
      "品名": "原味蛋餅",
      "價格": 30
    }
  ]
}
注意事項1:請完全依照格式來輸出
注意事項2:只需輸出第3部分的JSON
注意事項3:不需要輸出說明及標題
`


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
	const base64Image = await encodeImage("./image.png");

	const messages = [
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
		temperature:0.1,
		top_p:0.3,
		max_tokens: 8192,
	});

	console.log(response.choices[0]);
	} catch (error) {
		console.error("Error calling Gemini API:", error);
	}
}

main();
