import express from "express";
/* import morgan from "morgan";*/
import { readJSON } from "./utils.js";
import crypto from "node:crypto"
import { validateMovie, validatePartial } from "./schemas/movies.js";

const app = express()
/* app.use(morgan('dev'))*/
app.disable('x-powered-by')
app.use(express.json())

const allMovies = readJSON('./movies.json')

const ACCEPTE_ORIGINS = [
  'http://127.0.0.1:5500',
  'https://doobril.com',
  'https://midu.dev'
]

app.get('/', (req, res) => {
  res.send('Welcome API REST Movies')
})

app.get('/movies', (req, res) => {
  const origin = req.header('origin')
  if (ACCEPTE_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)

  }

  const { genre, title } = req.query

  try {

    if (genre) {
      const filterMovie = allMovies.filter(movie =>
        movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      )
      return res.json(filterMovie)
    }
    if (title) {
      const filterMovie = allMovies.filter(movie =>
        movie.title.toLowerCase() === title.toLocaleLowerCase()
      )
      return res.json(filterMovie)
    }

    res.status(200).json(allMovies)

  } catch (error) {
    console.log(error)
    res.send({ message: 'Algo fue mal' })

  }
})

app.get('/movies/:id', (req, res) => {
  try {
    const { id } = req.params
    const movieID = allMovies.find(movie => movie.id === id)

    if (movieID) return res.json(movieID)
    res.status(404).json({ message: 'movie not found' })

  } catch (error) {
    console.log(error)
  }
})

app.post('/movies', (req, res) => {

  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(422).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  //Esto no seria correcto ❌ ya que estamos mutando el array
  //y no estamos guardando en una base de datos solo en memoria
  allMovies.push(newMovie)
  res.status(201).json(allMovies)

})

app.patch('/movies/:id', (req, res) => {

  const result = validatePartial(req.body)
  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = allMovies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not fund' })
  }

  const updateMovie = {
    ...allMovies[movieIndex],
    ...result.data
  }

  res.json(updateMovie)


})

app.delete('/movies/:id', (req, res) => {
  try {
    const { id } = req.params

    const movieIndex = allMovies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
      return res.status(404).json({ message: 'movie not found' })
    }

    allMovies.splice(movieIndex, 1)
    return res.json({ message: 'Movie deleted' })

  } catch (error) {
    console.log(error)
  }
})

/* Para evitar los errores de cors en mis metodos*/
app.options('/movies/:id', (req, res) => {
  const origin = req.header('origin')

  if (ACCEPTE_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
    res.send(200)
  }
})


const port = process.env.PORT ?? 1234

app.listen(port, () => {
  console.log(`server listening on port http://localhost:${port}`)
})