import Joi from "joi";
import { MovieRepository } from '../models/repository/Movie.repository';
import HttpStatusCodes from "../utils/HttpStatusCodes";
import { FileArray } from "express-fileupload";
import FileSize from "filesize";

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

  public async validateCreateMovie(name: string, description: string, release_date: string, rating: number, ticket_price: number, country: string) {

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

      const validationResponse = Schema.validate({ name, description, release_date, rating, ticket_price, country }, { abortEarly: true, allowUnknown: true });

      console.log(validationResponse.error);

      if (validationResponse.error && validationResponse.error.details.length > 0) {
        this.Response.message = validationResponse.error.details[0].message;
        this.Response.status = false;

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

  public async validateUpdateMovie(name: string, description: string, release_date: string, rating: number, ticket_price: number, country: string, MovieId: string) {

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

      const validationResponse = Schema.validate({ name, description, release_date, rating, ticket_price, country }, { abortEarly: true, allowUnknown: true });
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


  public async validatePhotoUpload(Payload: FileArray) {

    try {
      /* Get the filesize && extension */
      const fileName: string = Payload.coverImage['name'];
      const fileSizeNumeric: number = Math.round(parseFloat(FileSize(Payload.coverImage['size']).split(' ')[0]));
      const fileSizeString: string = FileSize(Payload.coverImage['size']).split(' ')[1];
      const fileExtensionArray: string[] = fileName.split('.');
      const fileExtension: string = fileExtensionArray[fileExtensionArray.length - 1];

      if (fileSizeString == 'KB' || fileSizeString == 'B') {
        this.Response.statusCode = HttpStatusCodes.BAD_REQUEST;
        this.Response.message = "Sorry, The uploaded file exeeds the acceptable limit!";

        return this.Response;
      }

      if (fileSizeString == 'MB') {
        /* Do Code Validations */
        if (fileSizeNumeric > 5) {
          this.Response.status = true
          this.Response.message = 'Sorry, The uploaded image is too large!'
          this.Response.statusCode = HttpStatusCodes.BAD_REQUEST

          return this.Response;
        }
      }

      if (['GB', 'TB', 'PB', 'EB', 'ZB', 'YB'].includes(fileSizeString)) {

        this.Response.status = true
        this.Response.message = 'Sorry, The uploaded image is too large!'
        this.Response.statusCode = HttpStatusCodes.BAD_REQUEST

        return this.Response;
      }

      if (!['jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'heic'].includes(fileExtension.toLocaleLowerCase())) {
        this.Response.status = true;
        this.Response.message = 'Please, upload a valid image file!';
        this.Response.statusCode = HttpStatusCodes.BAD_REQUEST;

        return this.Response;
      }

      this.Response.status = true;
      this.Response.message = "Validation Passed!";

      return this.Response;
    } catch (err: unknown) {
      console.log(err, "An unexpected error occurred and the Movie could not be validated!");

      this.Response.status = false;
      this.Response.message = "An unexpected error occurred and the Genre could not be validated!";

      return this.Response;
    }
  }

}