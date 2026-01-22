import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Book } from '../../shared/models/book.model';
import { ApiBaseService } from './api-base.service';

@Injectable({ providedIn: 'root' })
export class BookService extends ApiBaseService<Book> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/books');
  }

  
  getAvailableBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}?availableCopies_gte=1`);
  }

  
  updateBook(id: number, changes: Partial<Book>): Observable<Book> {
    return this.update(id, changes); 
  }
}
