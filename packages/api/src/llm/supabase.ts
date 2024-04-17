import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { createClient } from '@supabase/supabase-js'
import type { DocumentToVectorStore } from '../types/documents'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

const supabaseKey: (string|undefined) = process.env.SUPABASE_API_KEY
if (!supabaseKey) throw new Error(`Expected SUPABASE_API_KEY`)

const url: (string|undefined) = process.env.SUPABASE_URL
if (!url) throw new Error(`Expected env var SUPABASE_URL`)

/**
 * Create the Vector Store
 *
 * @export
 * @return {*} 
 */
export async function supabaseVectorStore() {
  const client = createClient(url, supabaseKey)

  const vectorStore = new SupabaseVectorStore(
    new OpenAIEmbeddings(),
    {
      client,
      tableName: 'documents',
      queryName: 'match_documents',
    }
  )

  return vectorStore
}

/**
 * Adding docs to a Supabase Vector store from a PDF file
 *
 * @export
 * @param {} file - The file to add to the vector store
 */
export async function createAndStoreEmbeddings(file: File) {
  try {
    const docs = await loadingAndSplittingDocuments(file)
    const vectorStore = await supabaseVectorStore()
    vectorStore.addDocuments(docs)
    return docs
    
    
  } catch (e) {
    console.error("Error: ", e.message)
  }
}

/**
 * Loading and splitting data from a PDF file
 *
 * @export
 * @param {*} file
 * @return {Promise<DocumentToVectorStore[]>} - Retruns chunks of the PDF file
 */
export async function loadingAndSplittingDocuments(file: File): Promise<DocumentToVectorStore[]> {
  try {
    // Loading
  const loader = new PDFLoader(file)
  const docs = await loader.load()
  // Splitting
  const textSplitters = new RecursiveCharacterTextSplitter()
  const splits = await textSplitters.splitDocuments(docs)

  return splits
  } catch (error) {
    return error.message
  }
}