import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../../shared/models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'http://localhost:3000/books';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }
  updateBook(id: number, changes: Partial<any>) {
  return this.http.patch(`${this.apiUrl}/${id}`, changes);
}
getAvailableBooks() {
  return this.http.get<Book[]>(`${this.apiUrl}?availableCopies_gte=1`);
}


}
