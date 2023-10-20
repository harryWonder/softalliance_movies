import Controller from "./Controller";
import { GenreRepository } from '../models/repository/Genre.repository';
import { Request, Response } from "express";

export class GenreController extends Controller {

  private GenreRepository: GenreRepository;
  
  constructor() {

    super();

    this.GenreRepository = new GenreRepository();

  }

  public async createGenre(req: Request, res: Response) {
    
    try {
      const { name, is_active } = req.body as { name: string, is_active: boolean };

      
    } catch (err) {
      console.log(err, "An unexpected error occurred and the Genre could not be created!");

      return this.sendErrorResponse(res, "A server error occurred and this Genre could not be created!");
    }

  }

  public async updateGenre(req: Request, res: Response) {
    
    try {


    } catch (err) {
      console.log(err, "An unexpected error occurred and the Genre could not be created!");

      return this.sendErrorResponse(res, "A server error occurred and this Genre could not be created!");
    }

  }

  public async findGenre(req: Request, res: Response) {
    
    try {
      

    } catch (err) {
      console.log(err, "An unexpected error occurred and the Genre could not be created!");

      return this.sendErrorResponse(res, "A server error occurred and this Genre could not be created!");
    }

  }

  public async findGenres(req: Request, res: Response) {
    
    try {
      

    } catch (err) {
      console.log(err, "An unexpected error occurred and the Genre could not be created!");

      return this.sendErrorResponse(res, "A server error occurred and this Genre could not be created!");
    }

  }

  public async deleteGenre(req: Request, res: Response) {
    
    try {
      

    } catch (err) {
      console.log(err, "An unexpected error occurred and the Genre could not be created!");

      return this.sendErrorResponse(res, "A server error occurred and this Genre could not be created!");
    }

  }

}