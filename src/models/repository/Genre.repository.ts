import { FindOptionsOrderValue } from "typeorm";
import { Genre } from "../../entity/Genre.entity";
import { Model } from "../Model";

export class GenreRepository extends Model {

  constructor() { super(); }

  async createGenre(genre: Genre) {

    return await this.create(Genre, genre);

  }

  async findOneGenre(genre: Partial<Genre>) {

    return await this.findOne(Genre, { where: { ...genre } });

  }

  async findAllGenre(genre: Partial<Genre>, orderOptions: FindOptionsOrderValue = "ASC") {

    return await this.findMany(Genre, { where: { ...genre }, order: { created_at: orderOptions } });

  }

  async updateGenre(condition: Partial<Genre>, changes: Partial<Genre>) {

    return await this.update(Genre, condition, changes);

  }

}