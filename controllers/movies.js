import { MovieModel } from "../models/mysql/movie.js"
import { validateMovie,validatePartial } from "../schemas/movies.js"


export class MovieController {
  static async getAll(req, res) {

    const { genre, title } = req.query

    const allMovies = await MovieModel.getAll({ title, genre })

    res.status(200).json(allMovies)
  }

  static async getById(req, res) {

    const { id } = req.params

    const movieID = await MovieModel.getMovieByID({ id })

    if (movieID) return res.json(movieID)

    res.status(404).json({ message: 'movie not found' })
  }

  static async create(req, res) {

    const result = validateMovie(req.body)

    if (result.error) {
      return res.status(422).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = await MovieModel.create({ input: result.data })

    res.status(201).json(newMovie)

  }
  
  static async update(req, res) {

    const result = validatePartial(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const updatedMovie = await MovieModel.update({ id, input: result.data })

    return res.json(updatedMovie)
  }

  static async delete(req, res) {
    const { id } = req.params

    const resp = await MovieModel.delete({ id })

    if (resp === false) {
      return res.status(400).json({ message: 'Movie not founded' })
    }

    return res.json({ message: 'Movie deleted' })
  }
}
