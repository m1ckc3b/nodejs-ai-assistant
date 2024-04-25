import { ChatOpenAI } from "langchain/chat_models/openai";

export const model = new ChatOpenAI({
  openAIApiKey: c.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
  // temperature: 1,
  // topP: 1,
  // maxTokens: 1000,
  // frequencyPenalty: 0,
  // presencePenalty: 0,
  // stop: []
})