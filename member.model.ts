import { BaseModel } from './base.model';

export interface IMember {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

export class Member extends BaseModel implements IMember {
  constructor(
    id: number,
    public name: string,
    public email: string,
    public active: boolean
  ) {
    super(id);
  }
}
