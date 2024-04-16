import type { Document } from "langchain/document";

/**
 * Transform a Document[] into string
 *
 * @export
 * @param {Document[]} documents - The document to parse
 * @return {Promise<string>} - The document parsed
 */
export async function formatDocumentsAsString(documents: Document[]): Promise<string> {
  return documents.map(doc => doc.pageContent).join("\n")
}