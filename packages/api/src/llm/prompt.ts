import { ChatPromptTemplate } from "@langchain/core/prompts"; 

export const prompt = ChatPromptTemplate.fromTemplate(`
    Répond à la question suivante uniquement d'après le context donné: {context}
    Sépare la réponse des exemples par ###\n
    Question : {question}`
)