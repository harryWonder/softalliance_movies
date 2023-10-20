import Joi from "joi";
import { MovieRepository } from '../models/repository/Movie.repository';
import HttpStatusCodes from "../utils/HttpStatusCodes";

export class MovieValidator {

  private MovieRepository: MovieRepository;

  public Response: { status: boolean, message: string, statusCode: number };

  constructor() {
    this.Response = {
      status: false,
      message: "",
      statusCode: HttpStatusCodes.BAD_REQUEST
    };

    this.MovieRepository = new MovieRepository();
  }

  public async validateCreateMovie(name: string, is_active: boolean) {

    try {
      const Schema = Joi.object({
        name: Joi.string()
          .required()
          .messages({ "any.required": "Sorry, The movie name is required!", "string.base": "Please, supply a valid movie name!" }),
        description: Joi.string()
          .required()
          .messages({ "any.required": "Sorry, The movie description is required!", "string.base": "Please, supply a valid movie description!" }),
        release_date: Joi.date()
          .required()
          .messages({ "any.required": "Sorry, The movie release date is required!", "date.base": "Please, supply a valid date!" }),
        rating: Joi.number()
          .min(1)
          .max(5)
          .default(1),
        ticket_price: Joi.number()
          .min(0)
          .default(0),
        country: Joi.string()
          .required()
      });

      const validationResponse = Schema.validate({ name, is_active }, { abortEarly: true, allowUnknown: true });
      const isMovieNameUnique = await this.MovieRepository.findOneMovie({ name });

      console.log(validationResponse.error);

      if (validationResponse.error && validationResponse.error.details.length > 0) {
        this.Response.message = validationResponse.error.details[0].message;
        this.Response.status = false;

        return this.Response;
      }

      if (isMovieNameUnique) {
        this.Response.status = false;
        this.Response.message = "Sorry, A Movie with this name already exists!";
        this.Response.statusCode = HttpStatusCodes.CONFLICT;

        return this.Response;
      }

      this.Response.status = true;
      this.Response.message = "Validation Passed!";

      return this.Response;
    } catch (err) {
      console.log(err, "An unexpected error occurred and the Movie could not be validated!");
      this.Response.status = false;
      this.Response.message = "An unexpected error occurred and the Movie could not be validated!";

      return this.Response;
    }

  }

  public async validateUpdateMovie(name: string, is_active: boolean, MovieId: string) {

    try {
      const Schema = Joi.object({
        name: Joi.string()
          .required()
          .messages({ "any.required": "Sorry, The movie name is required!", "string.base": "Please, supply a valid movie name!" }),
        description: Joi.string()
          .required()
          .messages({ "any.required": "Sorry, The movie description is required!", "string.base": "Please, supply a valid movie description!" }),
        release_date: Joi.date()
          .required()
          .messages({ "any.required": "Sorry, The movie release date is required!", "date.base": "Please, supply a valid date!" }),
        rating: Joi.number()
          .min(1)
          .max(5)
          .default(1),
        ticket_price: Joi.number()
          .min(0)
          .default(0),
        country: Joi.string()
          .required()
      });

      const validationResponse = Schema.validate({ name, is_active }, { abortEarly: true, allowUnknown: true });
      if (validationResponse.error && validationResponse.error.details.length > 0) {
        this.Response.message = validationResponse.error.details[0].message;
        this.Response.status = false;

        return this.Response;
      }

      // Confirm the Movie exists...
      const isMovieValid = await this.MovieRepository.findOneMovie({ id: MovieId });
      if (!isMovieValid) {
        this.Response.status = false;
        this.Response.message = "Sorry, A Movie with this ID does not exist!";
        this.Response.statusCode = HttpStatusCodes.NOT_FOUND;

        return this.Response;
      }

      // Confirm the name is unique...
      const isNameUnique = await this.MovieRepository.findOneMovie({ name: name });
      if (isNameUnique && isNameUnique.id != MovieId) {
        this.Response.message = "Sorry, A Movie with this name already exists!";
        this.Response.status = false;
        this.Response.statusCode = HttpStatusCodes.CONFLICT;

        return this.Response;
      }

      this.Response.status = true;
      this.Response.message = "Validation Passed!";

      return this.Response;
    } catch (err) {
      console.log(err, "An unexpected error occurred and the Movie could not be validated!");

      this.Response.status = false;
      this.Response.message = "An unexpected error occurred and the Movie could not be validated!";

      return this.Response;
    }

  }

}