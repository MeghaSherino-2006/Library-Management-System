import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class ApiBaseService<T> {
  constructor(
    protected http: HttpClient,
    protected apiUrl: string
  ) {}

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl);
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  add(data: T): Observable<T> {
    return this.http.post<T>(this.apiUrl, data);
  }

  update(id: number, changes: Partial<T>): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}/${id}`, changes);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
