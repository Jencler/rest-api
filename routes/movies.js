import { Router } from "express";
import { readJSON } from "../utils.js";
import crypto from 'crypto'
import { validateMovie,validatePartial } from "../schemas/movies.js";



const allMovies = readJSON('./movies.json')

export const movieRouter = Router()

movieRouter.get('/', (req, res) => {

  const { genre, title } = req.query

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

})

movieRouter.get('/:id', (req, res) => {

  const { id } = req.params
  const movieID = allMovies.find(movie => movie.id === id)

  if (movieID) return res.json(movieID)
  res.status(404).json({ message: 'movie not found' })
})

movieRouter.post('/', (req, res) => {

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

movieRouter.patch('/:id', (req, res) => {
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

movieRouter.delete('/:id', (req, res) => {
  const { id } = req.params

  const movieIndex = allMovies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'movie not found' })
  }

  allMovies.splice(movieIndex, 1)
  return res.json({ message: 'Movie deleted' })
})