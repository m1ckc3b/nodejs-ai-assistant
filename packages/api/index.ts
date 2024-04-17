import { createClient } from "@supabase/supabase-js";
import { createAndStoreEmbeddings } from "./src/llm/supabase";
import { loadingAndSplittingDocuments } from "./src/llm/utils";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const supabaseKey: string = process.env.SUPABASE_API_KEY
const url: string = process.env.SUPABASE_URL


async function main() {
  // Loading
  console.log("Before loading...");
  const loader = new PDFLoader("src/Data/Node_js_Design_Patterns_Design_3rd.pdf")
  const docs = await loader.load()
  console.log("After loading...");
  
  
  // Splitting
  console.log("Before splitting");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
  })
  const splits = await splitter.splitDocuments(docs)
  console.log("After splitting");

  // Init supabase
  console.log("Before storing");
  const client = createClient(url, supabaseKey)

  // Init vector store
  const vectorStore = SupabaseVectorStore.fromDocuments(
    splits,
    new OpenAIEmbeddings(),
    {
      client,
      tableName: 'documents',
      queryName: 'match_documents',
    }
  )
  console.log("After storing");
  
}

await main()