import { model } from './model'
import { prompt } from './prompt'
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { retriever } from './supabase'
import { formatDocumentsAsString } from './utils';

export async function main(question: string): Promise<string> {
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
  
    return result

  } catch (error: any|unknown) {
    console.error("Error: ", error);
    return ""
  }
} 