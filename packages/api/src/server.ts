
import express, { type Request, type Response, type NextFunction } from "express"
import cors from "cors"

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Node.js AI Assistant!")
})

app.post("/api", (req: Request, res: Response) => {
  const { question } = req.body
  res.status(200).json({ response: "Bien reçue !!!", question })
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
})