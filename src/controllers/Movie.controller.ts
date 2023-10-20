import { Request, Response } from "express";
import { GenreRepository } from "../models/repository/Genre.repository";
import Controller from "./Controller";
import { MovieValidator } from "../validators/Movie.validator";
import { Status } from "../enums/Status.enum";
import HttpStatusCodes from "../utils/HttpStatusCodes";
import CloudinaryService from "../services/Cloudinary.service";
import { MovieRepository } from '../models/repository/Movie.repository';
import moment from "moment";
import { randomUUID } from "crypto";
import _ from "lodash"
import { MovieGenrePivotRepository } from "../models/repository/Movie-Genre-Pivot.repository";

export default new class MovieController extends Controller {

  private GenreRepository: GenreRepository;

  private MovieRepository: MovieRepository;

  private MovieValidator: MovieValidator;

  private MovieGenrePivotRepository: MovieGenrePivotRepository;

  constructor() {

    super();

    this.GenreRepository = new GenreRepository();

    this.MovieRepository = new MovieRepository();

    this.MovieValidator = new MovieValidator();

  }

  createMovie = async (req: Request, res: Response) => {

    try {
      const Body = req.files;
      const { name, description, release_date, rating, ticket_price, country, genres } = req.body as {
        name: string, description: string, release_date: string, rating: number, ticket_price: number, country: string, genres: string[]
      };

      // Validate The Movie Object
      const movieValidator = await this.MovieValidator.validateCreateMovie(name, description, release_date, rating, ticket_price, country);
      if (!movieValidator.status) {
        return this.sendErrorResponse(res, movieValidator.message, movieValidator.statusCode);
      }

      // Validate the Photo Object
      const isPhotoValid = await this.MovieValidator.validatePhotoUpload(Body);
      if (!isPhotoValid.status) {
        return this.sendErrorResponse(res, isPhotoValid.message, isPhotoValid.statusCode);
      }

      // Validate the Genres...
      const areGenresValid = await this.GenreRepository.findGenreByIDS(Status.Active, genres, "asc");
      if (areGenresValid.length != genres.length) {
        return this.sendErrorResponse(res, "Sorry, You have some inactive Genres! Please, update your selection and try again!", HttpStatusCodes.BAD_REQUEST);
      }

      // Upload the images to cloudinary...
      const imageUrl = await CloudinaryService.upload(Body);

      const movie = await this.MovieRepository.createMovie({
        name,
        slug: _.snakeCase(name),
        description,
        release_date: moment(release_date).toDate(),
        rating,
        ticket_price,
        country,
        photo: imageUrl,
        reference: randomUUID(),
        status_id: Status.Active
      });

      await this.MovieGenrePivotRepository.bulkPivot(genres.map(el => {
        return {
          genre_id: el,
          movie_id: movie.id
        }
      }));

      return this.sendSuccessResponse(res, { movie }, "Your movie has been created successfully!", HttpStatusCodes.CREATED);
    } catch (err) {
      console.log(err, "An unexpected error occurred and the movie could not be created!");

      return this.sendErrorResponse(res, "Sorry, This movie could not be created!");
    }

  }

  updateMovie = async (req: Request, res: Response) => {

    try {
      const Body = req.files;
      const { movieId } = req.params;
      const { name, description, release_date, rating, ticket_price, country, genres, } = req.body as {
        name: string, description: string, release_date: string, rating: number, ticket_price: number, country: string, genres: string[]
      };

      // Validate The Movie Object
      const movieValidator = await this.MovieValidator.validateUpdateMovie(name, description, release_date, rating, ticket_price, country, movieId);
      if (!movieValidator.status) {
        return this.sendErrorResponse(res, movieValidator.message, movieValidator.statusCode);
      }

      // Validate the Photo Object
      const isPhotoValid = await this.MovieValidator.validatePhotoUpload(Body);
      if (!isPhotoValid.status) {
        return this.sendErrorResponse(res, isPhotoValid.message, isPhotoValid.statusCode);
      }

      // Validate the Genres...
      const areGenresValid = await this.GenreRepository.findGenreByIDS(Status.Active, genres, "asc");
      if (areGenresValid.length != genres.length) {
        return this.sendErrorResponse(res, "Sorry, You have some inactive Genres! Please, update your selection and try again!", HttpStatusCodes.BAD_REQUEST);
      }

      // Upload the images to cloudinary...
      const imageUrl = await CloudinaryService.upload(Body);

      const movie = await this.MovieRepository.updateMovie({ id: movieId }, {
        name,
        slug: _.snakeCase(name),
        description,
        release_date: moment(release_date).toDate(),
        rating,
        ticket_price,
        country,
        photo: imageUrl,
        reference: randomUUID(),
        status_id: Status.Active
      });

      await this.MovieGenrePivotRepository.deletePivot({ movie_id: movieId });

      await this.MovieGenrePivotRepository.bulkPivot(genres.map(el => {
        return {
          genre_id: el,
          movie_id: movieId
        }
      }));

      return this.sendSuccessResponse(res, { movie }, "Your movie has been created successfully!", HttpStatusCodes.CREATED);
    } catch (err) {
      console.log(err, "An unexpected error occurred and the movie could not be updated!");

      return this.sendErrorResponse(res, "Sorry, This movie could not be updated!");
    }
  }

  fetchMovie = async (req: Request, res: Response) => {
    try {
      const { movieId } = req.params;

      const isMovieValid = await this.MovieRepository.findOneMovie({ id: movieId });
      if (!isMovieValid) {
        return this.sendErrorResponse(res, "Sorry, There is no movie with this ID!", HttpStatusCodes.NOT_FOUND);
      }

      return this.sendSuccessResponse(res, { movie: isMovieValid }, "The selected movie has been retrieved successfully!");
    } catch (err) {
      console.log(err, "An unexpected error occurred and the movie could not be retrieved!");

      return this.sendErrorResponse(res, "Sorry, This movie could not be retrieved!");
    }
  }

  fetchMovies = async (req: Request, res: Response) => {

    try {

      const movies = await this.MovieRepository.findAllMovie({}, "DESC");

      return this.sendSuccessResponse(res, { movies: movies }, "The selected movies has been retrieved successfully!");
    } catch (err) {
      console.log(err, "An unexpected error occurred and the movie could not be retrieved!");

      return this.sendErrorResponse(res, "Sorry, This movie could not be retrieved!");
    }

  }

  deleteMovie = async (req: Request, res: Response) => {
    try {

      const { movieId } = req.params;

      const isMovieValid = await this.MovieRepository.findOneMovie({ id: movieId });
      if (!isMovieValid) {
        return this.sendErrorResponse(res, "Sorry, There is no movie with this ID!", HttpStatusCodes.NOT_FOUND);
      }

      await this.MovieRepository.deleteMovie({ id: movieId });
      await this.MovieGenrePivotRepository.deletePivot({ movie_id: movieId });

      return this.sendSuccessResponse(res, { movie: isMovieValid }, "The selected movie has been deleted successfully!");

    } catch (err) {
      console.log(err, "An unexpected error occurred and the movie could not be deleted!");

      return this.sendErrorResponse(res, "Sorry, This movie could not be deleted!");
    }
  }


}