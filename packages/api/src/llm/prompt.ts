import { ChatPromptTemplate } from "@langchain/core/prompts"; 

export const prompt = ChatPromptTemplate.fromTemplate(`
    Répond à la question suivante uniquement d'après le context donné: {context}
    Donne des exemples de code quand cela est nécessaire. Si tu donne des exemples, sépare les de la réponse de 2 sauts à la ligne.
    Question : {question}`
)