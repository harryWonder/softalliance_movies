import { Request, Response } from "express";
import { GenreRepository } from "../models/repository/Genre.repository";
import { GenreValidator } from "../validators/Genre.validator";
import Controller from "./Controller";

export default new class MovieController extends Controller {

  private GenreRepository: GenreRepository;

  private GenreValidator: GenreValidator;

  constructor() {

    super();

    this.GenreRepository = new GenreRepository();

    this.GenreValidator = new GenreValidator();

  }

  createMovie = async (req: Request, res: Response) => {
    try {
      const { name, description, release_date, rating, ticket_price, country } = req.body;

      
    } catch (err) {
      console.log(err, "An unexpected error occurred and the movie could not be created!");

      return this.sendErrorResponse(res, "Sorry, This movie could not be created!");
    }

  }

  updateMovie = async (req: Request, res: Response) => {

  }

  fetchMovie = async (req: Request, res: Response) => {

  }

  fetchMovies = async (req: Request, res: Response) => {

  }

}