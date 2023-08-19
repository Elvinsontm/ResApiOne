import express from "express";
import crypto from 'node:crypto'
import cors from 'cors'
import {ValidarParametros, ValidarMovie} from './ValidadDatosPost.mjs'

//import el movies.json creando un metodo createRequire desde 0 ya que en ESmodule no lo trae y se usa este en este caso porque es 
import { createRequire } from "node:module";//mas rapido cargar grandes cantidades de dastos al no parse el json se hora tiempo
const require = createRequire(import.meta.url)
const Movie = require('./movies.json')


const app = express();

app.use(cors({  // Para darle acceso a la ruta al brauser para evitar el Cors "Cross-Origin Resource Sharing usando el paquete cors".
  origin:(origin,callback) =>{
    const ACCEPTED_ORIGINS =[
      'http://127.0.0.1:5500',
      'http://172.28.80.1:8080'
    ]

    if(ACCEPTED_ORIGINS.includes(origin)){
      return callback(null,true)
    }
    if(!origin){
      return callback(null,false)
    }
    return callback(new Error('No se encontro CORS'))
  }
}))

app.use((req, res, next) => {//Middleware, si es app.use('/.lala',(req, res, next) => solo se ejecutara en es endpoint y tabien comodin como /.lala*, tambien para un method en concreto : app.get

  res.setHeader("X-Powered-By", "MyApp");
  // Para darle acceso a la ruta al brouser para evitar el Cors "Cross-Origin Resource Sharing".
  // const origin = req.headers.origin;
  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header('Access-Control-Allow-Origin', "http://127.0.0.1:5500"); // Cambia '*' por el valor que necesites
  //   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  //   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  // }
  //------------------------------------------------------------------------------------------

  if ((req.method === "POST" || req.method === "PATCH") && req.headers["content-type"] === "application/json")
  { express.json()(req, res, next)}
  else return next();
});

app.get("/Movies", (req, res) => { // http://localhost:3000/Movies?genre=Action para buscar por genero o http://localhost:3000/Movies para traer todas las peliculas
    const{genre}= req.query
    if(genre){
        const Generofilms = Movie.filter(Movies=> Movies.genre.some(g =>g.toLowerCase() === genre.toLowerCase()))
        return res.status(201).json(Generofilms)
    }
    else return res.json(Movie);
});

app.get("/Movies/:id", (req, res) => { // buscar por id
    const {id} = req.params
    const IDmovie = Movie.find(MOVI => MOVI.id === id)
    if(IDmovie) return res.json(IDmovie)
    else return res.status(404).send('No encontrado')
  });

app.post("/Movies",(req,res)=>{ // introducir nueva pelicuala

  const Result = ValidarParametros(req.body)

  if(Result.error){
    return res.status(400).json({error: JSON.parse(Result.error.message)})
  }
  const Data ={
    id: crypto.randomUUID(),
    ...Result.data
  }

  try {
    Movie.push(Data);
    res.status(201).json({ mensaje: 'Datos guardados', Data });
  } catch (error) {
    console.error('Error al insertar en Movie:', error);
    res.status(500).json({ error: 'No se pudo insertar en el array' });
  }
})

app.patch("/Movies/:id",(req,res)=>{
  const {id} = req.params
  const result = ValidarMovie(req.body)

  if(!result.success){
    return res.status(401).json({error: JSON.parse(result.error.message)})
  }

  const Movieid = Movie.findIndex(movie=>movie.id === id)
  if(Movieid == -1) res.status(401).json({mensaje:'Pelicula no encontrada'})

  const UdateMovie = {
    ...Movie[Movieid],
    ...result.data
  }


  Movie[Movieid] = UdateMovie
  return res.status(201).json(UdateMovie)

})

// app.options('/Movies/:id',(req,res)=>{ si no se usa el paquete cors como midellawre hay que hacerlo manuel como esta qui para dar el permiso de eliminar
//   const origin = req.headers.origin;

//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', "http://127.0.0.1:5500"); // Cambia '*' por el valor que necesites
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   }
//   res.sendStatus(200)
// })

app.delete('/Movies/:id',(req,res)=>{
  const {id} = req.params
  const MovieIndex = Movie.findIndex(movie => movie.id === id);

  if (MovieIndex !== -1) {
    Movie.splice(MovieIndex, 1);
    res.json({ mensaje: 'Pelicula eliminada' });
  } else {
    res.status(404).json({ mensaje: 'Pelicula no encontrada' });
  }
})

app.use((req, res) => {
  res
    .setHeader("Content-Type", "text/html; charset=utf-8")
    .status(404)
    .send("<h1>Error 404</h1>");
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT , () => {
  console.log(`Servidor montado ruta http://localhost:${PORT}`);
});
