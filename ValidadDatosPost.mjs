import Zod from 'zod'

const MovieSchema =Zod.object({
    title: Zod.string({
      invalid_type_error: 'El nombre de la prelicula debe ser de tipo String',
      required_error:'Es requrido el nombre de la pelicula'
    }),
    year:Zod.number().int().min(1900),
    director:Zod.string({
      invalid_type_error: 'El nombre del director debe ser de tipo String',
      required_error:'Es requrido el nombre del director'
    }),
    duration:Zod.number().int().min(30).positive(),
    rate:Zod.number().positive().min(0).max(10).default(5),
    poster:Zod.string().url({
      message:' URL Poster inavalida'
    }),
    genre:Zod.array(
      Zod.enum(['Drama','Action','Horror','Crime','Adventure','Sci-Fi','Romance']),{
        invalid_type_error:'Tupo de datos invalido',
        required_error:'Se requiere introducir el genero de la pelicula'
      }
    )
  })

  export function ValidarParametros(object){
    return MovieSchema.safeParse(object)
  }

  export function ValidarMovie(object){
    return MovieSchema.partial().safeParse(object)
  }


  
