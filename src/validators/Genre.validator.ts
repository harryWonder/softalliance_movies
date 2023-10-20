import Joi from "joi";


export class GenreValidator {

  public Response: { status: boolean, message: string };

  constructor() {
    this.Response = {
      status: false,
      message: ""
    };
  }

  public async validateCreateGenre(name: string, is_active: boolean) {

    try {
      const Schema = Joi.object({
        name: Joi.string()
          .required(),
        is_active: Joi.boolean()
          .required()
      });

      const validationResponse = Schema.validateAsync({ name, is_active });
      console.log(validationResponse, "Joi validation response!");

      return true;
    } catch (err) {
      console.log(err, "An unexpected error occurred and the Genre could not be validated!");
    }

  }

  public async validateUpdateGenre(name: string, is_active: boolean, genreId: number) {

    try {
      const Schema = Joi.object({
        name: Joi.string()
          .required(),
        is_active: Joi.boolean()
          .required()
      });

      const validationResponse = Schema.validateAsync({ name, is_active });
      console.log(validationResponse, "Joi validation response!");

      return true;
    } catch (err) {
      console.log(err, "An unexpected error occurred and the Genre could not be validated!");
    }

  }

}