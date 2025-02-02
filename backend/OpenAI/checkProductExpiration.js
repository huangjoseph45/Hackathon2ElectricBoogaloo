const OpenAI = require("openai");
const { zodResponseFormat } = require("openai/helpers/zod");
const z = require("zod");
const API_KEY = process.env.OPENAI_KEY;

const responseFormat = z.object({
  items: z.array(
    z.object({
      foodName: z.string(),
      isSafe: z.boolean(),
      estimatedSafetyDate: z.string(),
      explanation: z.string(),
    })
  ),
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
    const openai = new OpenAI({
      apiKey: API_KEY,
    });
    const date = new Date();
    const response = await withTimeout(
      openai.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant. You will evaluate the safety of the following foods and output a valid JSON array with evaluation details. Today's date is ${date.toDateString()}. If the food item is not a valid food item, simply make isSafe false. Ensure the output is valid JSON.`,
          },
          {
            role: "user",
            content: req,
          },
        ],
        temperature: 0.2,
        max_tokens: 300, // Increased from 150 to allow a complete response
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        response_format: zodResponseFormat(responseFormat, "expiration"),
      }),
      15000 // Timeout in milliseconds (15 seconds)
    );

    // Return an array of responses (each response is the content of a choice)
    const choiceMap = response.choices.map((choice) => choice.message.content);
    return JSON.parse(choiceMap).items;
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
