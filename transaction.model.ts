import { BaseModel } from './base.model';

export type TransactionStatus = 'BORROWED' | 'RETURNED';

export interface ITransaction {
  id: number;
  memberId: number;
  bookId: number;
  borrowedDate: string;
  dueDate: string;
  status: TransactionStatus;
  returnedDate?: string;
}

export class Transaction extends BaseModel implements ITransaction {
  constructor(
    id: number,
    public memberId: number,
    public bookId: number,
    public borrowedDate: string,
    public dueDate: string,
    public status: TransactionStatus,
    public returnedDate?: string
  ) {
    super(id);
  }

  
  public isOverdue(today: Date = new Date()): boolean {
    return this.status === 'BORROWED' && new Date(this.dueDate) < today;
  }
}
