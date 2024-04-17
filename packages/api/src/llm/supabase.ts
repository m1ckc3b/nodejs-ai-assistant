import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "@supabase/supabase-js";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import type { Document } from "langchain/document";

if (!process.env.SUPABASE_API_KEY) throw new Error(`Expected SUPABASE_API_KEY`);
const supabaseKey = process.env.SUPABASE_API_KEY;

if (!process.env.SUPABASE_URL) throw new Error(`Expected env var SUPABASE_URL`);
const url = process.env.SUPABASE_URL;

/**
 * Create the Vector Store
 *
 * @export
 * @return vectorStore - The instance of the vector store created
 */
export async function supabaseVectorStore() {
  const client = createClient(url, supabaseKey);

  const vectorStore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
    client,
    tableName: "documents",
    queryName: "match_documents",
  });

  return vectorStore;
}

/**
 * Adding docs to a Supabase Vector store from a PDF file
 *
 * @export
 * @param file - The file to add to the vector store
 */
export async function createAndStoreEmbeddings(file: File) {
  try {
    // Get chunks
    const docs = await loadingAndSplittingDocuments(file);
    // Init vector store
    const vectorStore = await supabaseVectorStore();
    // Adding chunks to vector store
    vectorStore.addDocuments(docs);
  } catch (error: any | unknown) {
    console.error("ERROR: ", error.message);
  }
}

/**
 * Loading and splitting data from a PDF file
 *
 * @param file - The file to load and split
 * @return Returns chunks of the PDF file
 */
async function loadingAndSplittingDocuments(file: File): Promise<Document[]> {
  // Loading
  const loader = new PDFLoader(file);
  const docs = await loader.load();
  // Splitting
  const textSplitters = new RecursiveCharacterTextSplitter();
  return await textSplitters.splitDocuments(docs);
}
