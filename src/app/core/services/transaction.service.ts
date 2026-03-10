import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../../shared/models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:3000/transactions';

  constructor(private http: HttpClient) {}

  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }
  updateTransaction(id: number, changes: Partial<Transaction>) {
  return this.http.patch<Transaction>(`${this.apiUrl}/${id}`, changes);
}

getBorrowedTransactions(): Observable<Transaction[]> {
  return this.http.get<Transaction[]>(`${this.apiUrl}?status=BORROWED`);
}

}
