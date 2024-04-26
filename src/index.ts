import { Hono } from "hono";
import ui from './ui/index.html'
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate } from "langchain/prompts";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MultiQueryRetriever } from "langchain/retrievers/multi_query";
import { RunnablePassthrough, RunnableSequence } from "langchain/runnables";
import { StringOutputParser } from "langchain/schema/output_parser";
import { formatDocumentsAsString } from "./utils";

const app = new Hono()

app.get('/', (c) => {
  return c.html(ui)
})

app.get('/query', async (c) => {
  const question = c.req.query("text")

  // Model
  const model = new ChatOpenAI({
    openAIApiKey: c.env.OPENAI_API_KEY
  })
  // Prompt
  const prompt = ChatPromptTemplate.fromTemplate(`
  Répond à la question suivante uniquement d'après le context donné: {context}
  Donne des exemples de code quand c'est nécessaire.
  La réponse doit être formatée en HTML, le texte dans une balise <p> et les exemples de code dans une balise <code>.
  Dans les balises <code> respecte la mise en forme, comme les sauts de ligne. 
  Question : {question}`)
  // Retriever
  const supabaseKey = c.env.SUPABASE_API_KEY
  const url = c.env.SUPABASE_URL
  const client = createClient(url, supabaseKey);

const vectorStore = new SupabaseVectorStore(new OpenAIEmbeddings({ apiKey: c.env.OPENAI_API_KEY}), {
  client,
  tableName: "documents",
  queryName: "match_documents",
});

const retriever = MultiQueryRetriever.fromLLM({
  llm: model,
  retriever: vectorStore.asRetriever(),
  verbose: true
})
  // Chain
  try {
    const chain = RunnableSequence.from([
      {
        context: retriever.pipe(formatDocumentsAsString),
        question: new RunnablePassthrough()
      },
      prompt,
      model,
      new StringOutputParser()
    ]) 
    const result = await chain.invoke(question)
  
    return c.html(`<div class="message bot-message">${result}</div>`)

  } catch (error: any|unknown) {
    console.error("Error: ", error);
    return c.html(`<div class="message bot-message">${error.message}</div>`)
  }
  
})

app.get('/notfound', (c) => {
  return c.notFound()
})


export default app