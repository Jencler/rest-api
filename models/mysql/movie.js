
import mysql from "mysql2/promise";

const config = {
  host: 'localhost',
  user: 'root',
  port: process.env.PORT ?? 3306,
  password: 'root1234',
  database: 'moviesdb'
}

const conection = await mysql.createConnection(config)


export class MovieModel {

  static async getAll({ title, genre }) {

    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      const [genres] = await conection.query(
        'select id, nombre from genre where lower(nombre) = ?;',
        [lowerCaseGenre]
      )

      if (genres.length === 0) return []

      const [{ id }] = genres

      const { "0": result, "1": tabla } = await conection.query(
        'select m.title,m.year,m.director,m.duration,m.poster,m.rate, bin_to_uuid(id) id from movie m inner join  movie_genres g on m.id=g.movie_id where g.genre_id = ?;',
        [id]
      )
      console.log(result)
      return result
    }

    if (title) {
      const lowerCasetitle = title.toLowerCase()

      const [titles] = await conection.query(
        'select title,year,director,duration,poster,rate,bin_to_uuid(id) id from movie where lower(title) = ?;',
        [lowerCasetitle]
      )

      if (titles.length === 0) return []

      return titles

    }

    const { "0": result, "1": table } = await conection.query(
      'select title,year,director,duration,poster,rate,bin_to_uuid(id) id from movie'
    )

    return result
  }


  static async getMovieByID({ id }) {

    const { "0": result, "1": tabla } = await conection.query(
      `select title,year,director,duration,poster,rate,bin_to_uuid(id) id
      from movie where id = uuid_to_bin(?);`,
      [id]

    )
    if (result.length === 0) return []
    return result
  }


  static async create({ input }) {

   

    const {
      genre: genreInput, //genre is an array
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    const [uuidResult] = await conection.query(
      'select UUID() uuid;'
    )

    const [{ uuid }] = uuidResult

    try {
      await conection.query(
        `insert into movie (id, title, year, director, duration, poster, rate) values
        (uuid_to_bin("${uuid}"),?,?,?,?,?,?);`,
        [title, year, director, duration, poster, rate]
      )
    } catch (e) {
      throw new Error('Error creating movie')
    }

    const [movies] = await conection.query(
      `select title,year,director,duration,poster,rate,bin_to_uuid(id) id 
      from movie where id =uuid_to_bin(?);`,
      [uuid]
    )
    return movies[0]
  }

  static async update({ id, input }) {

  }


  static async delete({ id }) {

  }

}