import { MovieGenrePivot } from "../../entity/Movie-Genre-Pivot.entity";
import { Model } from "../Model";

export class MovieGenrePivotRepository extends Model {

  constructor() { super(); }

  async createPivot(model: MovieGenrePivot) {

    return await this.create(MovieGenrePivot, model);

  }

  async bulkPivot(model: MovieGenrePivot[]) {

    return await this.bulkInsert(MovieGenrePivot, model);

  }

  async updatePivot(condition: Partial<MovieGenrePivot>, changes: Partial<MovieGenrePivot>) {

    return await this.update(MovieGenrePivot, condition, changes);

  }

  async deletePivot(condition: Partial<MovieGenrePivot>) {

    return await this.delete(MovieGenrePivot, condition);

  }

}