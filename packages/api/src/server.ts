
import express, { type Request, type Response, type NextFunction } from "express"
import cors from "cors"
import { chain } from "./llm/chain"

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Node.js AI Assistant!")
})

app.post("/api", async (req: Request, res: Response) => {
  const { question } = req.body
  // TO DO: adding the handle function
  const result = await chain(question)
  res.status(200).json({ response: result, question })
})

app.put('/upload', async (req: Request, res: Response) => {
  // TO DO: adding the handle function
  res.status(200).send("OK !!!")
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
})