import express from "express";
import { movieRouter } from "./routes/movies.js";
import { corsMiddlewares } from "./middlewares/cors.js";

const app = express()

app.disable('x-powered-by')

app.use(express.json())

app.use(corsMiddlewares())

app.get('/', (req, res) => {
  res.json({ message: 'Welcome API REST Movies' })
})

app.use('/movies', movieRouter)

const port = process.env.PORT ?? 1234

app.listen(port, () => {
  console.log(`server listening on port http://localhost:${port}`)
})