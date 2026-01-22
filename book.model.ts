import { BaseModel } from './base.model';

export interface IBook {
  id: number;
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
  availableCopies: number;
  totalCopies: number;
  description: string;
  coverUrl: string;
}

export class Book extends BaseModel implements IBook {
  constructor(
    id: number,
    public title: string,
    public author: string,
    public genre: string,
    public publishedYear: number,
    public availableCopies: number,
    public totalCopies: number,
    public description: string,
    public coverUrl: string,
  ) {
    super(id);
  }


  public isAvailable(): boolean {
    return this.availableCopies > 0;
  }
}
