import { readJSON } from '../../utils.js'
import { randomUUID } from 'node:crypto'

const allMovies = readJSON('./movies.json')

export class MovieModel {

  static async getAll({ title, genre }) {

    if (genre) {
      return allMovies.filter(movie =>
        movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      )
    }

    if (title) {
      return allMovies.filter(movie =>
        movie.title.toLowerCase() === title.toLocaleLowerCase()
      )
    }
    return allMovies
  }

  static async getMovieByID({ id }) {
    const movieID = allMovies.find(movie => movie.id === id)

    return movieID
  }

  static async create({ input }) {

    const newMovie = {
      id: randomUUID(), // Aqui la logica de negocio ya crea mi UUID
      ...input
    }

    allMovies.push(newMovie)

    return newMovie
  }

  static async update({ id, input }) {
    const movieIndex = allMovies.findIndex(movie => movie.id === id)

    allMovies[movieIndex] = {
      ...allMovies[movieIndex],
      ...input
    }
    return allMovies[movieIndex]
  }

  static async delete({ id }) {
    const movieIndex = allMovies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) return false

    allMovies.splice(movieIndex, 1)

    return true
  }

}