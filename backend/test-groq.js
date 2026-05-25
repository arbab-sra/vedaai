require('dotenv').config();
const { Groq } = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
async function test() {
  try {
    const res = await groq.chat.completions.create({
      messages: [{ role: "user", content: "hello" }],
      model: process.env.AI_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct"
    });
    console.log("Success:", JSON.stringify(res).substring(0, 100));
  } catch (e) {
    console.log("Error type:", e.constructor.name);
    console.log("Error message:", e.message);
  }
}
test();
