import Controller from "./Controller";
import { GenreRepository } from '../models/repository/Genre.repository';
import { Request, Response } from "express";
import { GenreValidator } from "../validators/Genre.validator";
import HttpStatusCodes from "../utils/HttpStatusCodes";
import { Status } from "../enums/Status.enum";

export default new class GenreController extends Controller {

  private GenreRepository: GenreRepository;

  private GenreValidator: GenreValidator;

  constructor() {

    super();

    this.GenreRepository = new GenreRepository();

    this.GenreValidator = new GenreValidator();

  }

  createGenre = async (req: Request, res: Response) => {

    try {

      const { name, is_active } = req.body as { name: string, is_active: boolean };
      const Validator = await this.GenreValidator.validateCreateGenre(name, is_active);

      if (!Validator.status) {
        return this.sendErrorResponse(res, Validator.message, Validator.statusCode);
      }

      const newGenre = await this.GenreRepository.createGenre({
        name: name,
        status_id: is_active ? Status.Active : Status.Inactive
      });

      return this.sendSuccessResponse(res, { genre: newGenre }, "Your Genre has been created successfully!", HttpStatusCodes.CREATED);
    } catch (err) {
      console.log(err, "An unexpected error occurred and the Genre could not be created!");

      return this.sendErrorResponse(res, "A server error occurred and this Genre could not be created!");
    }

  }

  updateGenre = async (req: Request, res: Response) => {

    try {

      const { name, is_active } = req.body as { name: string, is_active: boolean };
      const { genreId } = req.params;

      const Validator = await this.GenreValidator.validateUpdateGenre(name, is_active, genreId);

      if (!Validator.status) {
        return this.sendErrorResponse(res, Validator.message, Validator.statusCode);
      }

      const updatedGenre = await this.GenreRepository.updateGenre({ id: genreId}, { name, status_id: is_active ? Status.Active : Status.Inactive });
      if (updatedGenre) {
        return this.sendSuccessResponse(res, {}, "Your Genre has been updated successfully!");
      }

      return this.sendErrorResponse(res, "Sorry, Your genre could not be updated. Please, try again!", HttpStatusCodes.BAD_REQUEST);
    } catch (err) {
      console.log(err, "An unexpected error occurred and the Genre could not be updated!");

      return this.sendErrorResponse(res, "A server error occurred and this Genre could not be updated!");
    }

  }

  findGenre = async (req: Request, res: Response) => {

    try {

      const { genreId } = req.params;

      const isGenreValid = await this.GenreRepository.findOneGenre({ id: genreId });
      if (!isGenreValid) {
        return this.sendErrorResponse(res, "Sorry, A Genre with this ID could not be found!", HttpStatusCodes.NOT_FOUND);
      }

      return this.sendSuccessResponse(res, { genre: isGenreValid }, "Genre retrieved successfully!");
    } catch (err) {
      console.log(err, "An unexpected error occurred and the Genre could not be retrieved!");

      return this.sendErrorResponse(res, "A server error occurred and this Genre could not be retrieved!");
    }

  }

  findGenres = async (req: Request, res: Response) => {

    try {

      const isGenreValid = await this.GenreRepository.findAllGenre({ }, "ASC");
      if (!isGenreValid) {
        return this.sendErrorResponse(res, "Sorry, A Genre with this ID could not be found!", HttpStatusCodes.NOT_FOUND);
      }

      return this.sendSuccessResponse(res, { genre: isGenreValid }, "Genre retrieved successfully!");
    } catch (err) {
      console.log(err, "An unexpected error occurred and the Genre could not be retrieved!");

      return this.sendErrorResponse(res, "A server error occurred and the Genres could not be retrieved!");
    }

  }

  public async deleteGenre(req: Request, res: Response) {

    try {

      const { genreId } = req.params;

      const isGenreValid = await this.GenreRepository.findOneGenre({ id: genreId });
      if (!isGenreValid) {
        return this.sendErrorResponse(res, "Sorry, A Genre with this ID could not be found!", HttpStatusCodes.NOT_FOUND);
      }

      await this.GenreRepository.deleteGenre({ id: genreId });
      // Delete the GenreID from the Pivot Table....

      return this.sendSuccessResponse(res, { genre: isGenreValid }, "Genre deleted successfully!");
    } catch (err) {
      console.log(err, "An unexpected error occurred and the Genre could not be deleted!");

      return this.sendErrorResponse(res, "A server error occurred and this Genre could not be deleted!");
    }

  }

}