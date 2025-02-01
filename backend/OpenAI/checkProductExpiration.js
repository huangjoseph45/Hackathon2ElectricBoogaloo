const OpenAI = require("openai");
const { zodResponseFormat } = require("openai/helpers/zod");
const z = require("zod");
const API_KEY = process.env.OPENAI_KEY;

const openai = new OpenAI({
  apiKey: API_KEY,
});

const responseFormat = z.object({
  foodName: z.string(),
  isSafe: z.boolean(),
  estimatedSafetyDate: z.string(),
  explanation: z.string(),
});

// Helper function that races a promise against a timeout
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Operation timed out after ${ms} ms`)),
        ms
      )
    ),
  ]);
}

const checkExpiration = async (req) => {
  try {
    const date = new Date();
    const response = await withTimeout(
      openai.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant. You will evaluate the safety of the following foods following or shortly before their expiration. Today's date is ${date.toDateString()}`,
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
        response_format: zodResponseFormat(responseFormat, "expiration"),
      }),
      5000 // 5 seconds
    );

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Caught Error:", error);
    return {
      errorCode: 400,
      error: error.message,
    };
  }
};

module.exports = {
  checkExpiration,
};
