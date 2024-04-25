
import express, { type Request, type Response, type NextFunction } from "express"
import cors from "cors"
import { main } from "./llm"

const app = express()
app.use(express.json())
app.use(cors())

const port = process.env.PORT || 3000


app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Node.js AI Assistant!")
})

app.post("/api", async (req: Request, res: Response) => {
  const { question } = req.body
  
  const result = await main(question)
  res.status(200).send(result)
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