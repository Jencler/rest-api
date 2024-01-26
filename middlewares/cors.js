import cors from "cors"

const ACCEPTE_ORIGINS = [
  'http://127.0.0.1:5500',
  'https://doobril.com',
  'https://midu.dev'
]

export const corsMiddlewares = ({acceptedOrigins = ACCEPTE_ORIGINS} = {}) => cors({
  origin: (origin, callback) => {
   
    if (acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }
    if (!origin) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by Cors'))
  }
})