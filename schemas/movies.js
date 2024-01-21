import z from 'zod'

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: "Movie title must be a string",
    required_error: 'title movie is required'
  }),
  year: z.number().min(1900).max(2024),
  director: z.string({
    invalid_type_error: "Movie year must be a string",
    required_error: 'Year movie is required'
  }),
  duration: z.number().positive(),
  poster: z.string().url({
    message: 'Invalid URL'
  }),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Terror', 'Sci-Fi']),
    {
      required_error: 'Movie genre is required',
      invalid_type_error: 'Movie genre must be a array of enums Genre'
    }
  ),
  rate: z.number().min(0).max(10).default(5),
})


export const validateMovie = (object) => {
  return movieSchema.safeParse(object)
}
export const validatePartial = (input) => {
  return movieSchema.partial().safeParse(input)
}