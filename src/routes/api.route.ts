import { Application } from "express";
import GenreController from "../controllers/Genre.controller";
import MovieController from "../controllers/Movie.controller";
import { Movie } from "../entity/Movie.entity";

export const Routes = ((Route: Application): void => {

  /* Genres API */
  Route.post('/api/v1/genre', GenreController.createGenre);

  Route.put('/api/v1/genre/:genreId', GenreController.updateGenre);

  Route.get('/api/v1/genre/:genreId', GenreController.findGenre);

  Route.get('/api/v1/genre', GenreController.findGenres);

  Route.delete('/api/v1/genre/:genreId', GenreController.deleteGenre);


  /* Movies API */
  Route.post('/api/v1/movie', MovieController.createMovie);

  Route.put('/api/v1/movie/:movieId', MovieController.updateMovie);

  Route.get('/api/v1/movie/:movieId', MovieController.fetchMovie);

  Route.get('/api/v1/movie', MovieController.fetchMovies);

  Route.delete('/api/v1/movie/:movieId', MovieController.deleteMovie);

});