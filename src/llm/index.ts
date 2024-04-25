import { prompt } from "./prompt";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { formatDocumentsAsString } from "./utils";
import { Context } from "hono";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { MultiQueryRetriever } from "langchain/retrievers/multi_query";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";


export async function getResponseFromLLM(
  c: Context,
  question: string
): Promise<string> {
  try {
    // Model
    const model = new ChatOpenAI({
      openAIApiKey: c.env.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
      // temperature: 1,
      // topP: 1,
      // maxTokens: 1000,
      // frequencyPenalty: 0,
      // presencePenalty: 0,
      // stop: []
    });

    // Retriever
    const supabaseKey = c.env.SUPABASE_API_KEY;
    const url = c.env.SUPABASE_URL;
    const client = createClient(url, supabaseKey);

    const vectorStore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
      client,
      tableName: "documents",
      queryName: "match_documents",
    });

    const retriever = MultiQueryRetriever.fromLLM({
      llm: model,
      retriever: vectorStore.asRetriever(),
      verbose: true,
    });

    // Chain
    const chain = RunnableSequence.from([
      {
        context: retriever.pipe(formatDocumentsAsString),
        question: new RunnablePassthrough(),
      },
      prompt,
      model,
      new StringOutputParser(),
    ]);

    const result = await chain.invoke(question);

    return result;
  } catch (error: any | unknown) {
    return "";
  }
}
