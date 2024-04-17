import { ChatPromptTemplate } from "@langchain/core/prompts"; 

export const prompt = ChatPromptTemplate.fromTemplate(`
    Répond à la question suivante uniquement d'après le context donné: {context}
    Donne des exemples de code quand c'est nécessaire.
    Sépare la réponse des exemples de code par ###\n\n
    Question : {question}`
)