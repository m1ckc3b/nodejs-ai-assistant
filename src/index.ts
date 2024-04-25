import { Hono } from 'hono'
import { getResponseFromLLM } from './llm'

export type ENV = {
  OPENAI_API_KEY: string,
  SUPABASE_API_KEY: string,
  SUPABASE_URL: string
}

const app = new Hono<{ Bindings: ENV }>()

app.post('/api', async (c) => {
  const body = await c.req.json()
  const question = body.question
  const response = await getResponseFromLLM(c, question)
  
  return c.text(response)
})

export default app
