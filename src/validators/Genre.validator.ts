import Joi from "joi";
import { GenreRepository } from '../models/repository/Genre.repository';
import HttpStatusCodes from "../utils/HttpStatusCodes";

export class GenreValidator {

  private GenreRepository: GenreRepository;

  public Response: { status: boolean, message: string, statusCode: number };

  constructor() {
    this.Response = {
      status: false,
      message: "",
      statusCode: HttpStatusCodes.BAD_REQUEST
    };

    this.GenreRepository = new GenreRepository();
  }

  public async validateCreateGenre(name: string, is_active: boolean) {

    try {
      const Schema = Joi.object({
        name: Joi.string()
          .required()
          .messages({ "any.required": "Sorry, The name field is required", "string.base": "Sorry, Please, supply a valid name!" }),
        is_active: Joi.boolean()
          .required()
          .messages({ "any.required": "Sorry, The is_active field is required", "boolean.base": "Sorry, The is_active field must be a boolean!" })
      });

      const validationResponse = Schema.validate({ name, is_active }, { abortEarly: true });
      const isGenreNameUnique = await this.GenreRepository.findOneGenre({ name });

      console.log(validationResponse.error);

      if (validationResponse.error && validationResponse.error.details.length > 0) {
        this.Response.message = validationResponse.error.details[0].message;
        this.Response.status = false;

        return this.Response;
      }

      if (isGenreNameUnique) {
        this.Response.status = false;
        this.Response.message = "Sorry, A Genre with this name already exists!";
        this.Response.statusCode = HttpStatusCodes.CONFLICT;

        return this.Response;
      }

      this.Response.status = true;
      this.Response.message = "Validation Passed!";

      return this.Response;
    } catch (err) {
      console.log(err, "An unexpected error occurred and the Genre could not be validated!");
      this.Response.status = false;
      this.Response.message = "An unexpected error occurred and the Genre could not be validated!";

      return this.Response;
    }

  }

  public async validateUpdateGenre(name: string, is_active: boolean, genreId: string) {

    try {
      const Schema = Joi.object({
        name: Joi.string()
          .required()
          .messages({ "any.required": "Sorry, The name field is required", "string.base": "Sorry, Please, supply a valid name!" }),
        is_active: Joi.boolean()
          .required()
          .messages({ "any.required": "Sorry, The is_active field is required", "boolean.base": "Sorry, The is_active field must be a boolean!" })
      });

      const validationResponse = Schema.validate({ name, is_active }, { abortEarly: true });
      if (validationResponse.error && validationResponse.error.details.length > 0) {
        this.Response.message = validationResponse.error.details[0].message;
        this.Response.status = false;

        return this.Response;
      }

      // Confirm the Genre exists...
      const isGenreValid = await this.GenreRepository.findOneGenre({ id: genreId });
      if (!isGenreValid) {
        this.Response.status = false;
        this.Response.message = "Sorry, A Genre with this ID does not exist!";
        this.Response.statusCode = HttpStatusCodes.NOT_FOUND;

        return this.Response;
      }

      // Confirm the name is unique...
      const isNameUnique = await this.GenreRepository.findOneGenre({ name: name });
      if (isNameUnique && isNameUnique.id != genreId) {
        this.Response.message = "Sorry, A Genre with this name already exists!";
        this.Response.status = false;
        this.Response.statusCode = HttpStatusCodes.CONFLICT;

        return this.Response;
      }

      this.Response.status = true;
      this.Response.message = "Validation Passed!";

      return this.Response;
    } catch (err) {
      console.log(err, "An unexpected error occurred and the Genre could not be validated!");

      this.Response.status = false;
      this.Response.message = "An unexpected error occurred and the Genre could not be validated!";

      return this.Response;
    }

  }

}