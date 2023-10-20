import { FindOptionsOrderValue, In } from "typeorm";
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
  
  async findGenreByIDS(status: number, ids: string[], orderOptions: FindOptionsOrderValue = "ASC") {

    return await this.findMany(Genre, {
      where: {
        id: In(ids),
        status_id: status
      },
      order: {
        created_at: orderOptions
      }
    })

  }

  async updateGenre(condition: Partial<Genre>, changes: Partial<Genre>) {

    return await this.update(Genre, condition, changes);

  }

  async deleteGenre(condition: Partial<Genre>) {
    
    return await this.delete(Genre, condition);

  }

}