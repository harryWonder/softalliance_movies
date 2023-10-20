import { Application } from "express";
import GenreController from "../controllers/Genre.controller";

export const Routes = ((Route: Application): void => {

  Route.post('/api/v1/genre', GenreController.createGenre);

  Route.put('/api/v1/genre/:genreId', GenreController.updateGenre);

  Route.get('/api/v1/genre/:genreId', GenreController.findGenre);

  Route.get('/api/v1/genre', GenreController.findGenres);

});