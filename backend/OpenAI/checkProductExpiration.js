const OpenAI = require("openai");
const zodResponseFormat = require("openai/helpers/zod");
const z = require("zod");
const API_KEY = process.env.OPENAI_KEY;

const openai = new OpenAI({
  apiKey: API_KEY,
});

const responseFormat = z.object({
  foodName: z.string(),
  isSafe: z.boolean(),
  estimatedSafetyDate: z.date(),
  explanation: z.string(),
});

const checkExpiration = async (req) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. You will evaluate the safety of the following foods following or shortly before their expiration.",
        },
        {
          role: "user",
          content: `Food Item: ${req}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: zodResponseFormat(responseFormat),
    });
    console.log("Running");

    console.log(response.choices[0].message);
  } catch (error) {
    return {
      errorCode: 400,
      error: error,
    };
  }
};

module.exports = {
  checkExpiration,
};
