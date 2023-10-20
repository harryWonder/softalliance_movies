import { Model } from "../Model";

export class MovieGenrePivot extends Model {

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

}