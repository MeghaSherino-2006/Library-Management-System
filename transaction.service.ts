import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../../shared/models/transaction.model';
import { ApiBaseService } from './api-base.service';
import { Observable } from 'rxjs';
import { ITransaction } from '../../shared/models/transaction.model';


@Injectable({ providedIn: 'root' })
export class TransactionService extends ApiBaseService<ITransaction> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/transactions');
  }

  getBorrowedTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}?status=BORROWED`);
  }
}
