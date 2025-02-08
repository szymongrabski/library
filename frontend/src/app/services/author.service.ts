import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environgment';
import { Author } from '../models/author.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private apiUrl = `${environment.apiUrl}/authors`;
  private allAuthors = signal<Author[]>([]);

  constructor(private http: HttpClient) {
    this.loadAllAuthors();
  }

  loadAllAuthors(): void {
    this.http.get<Author[]>(`${this.apiUrl}/all`).subscribe(data => {
      this.allAuthors.set(data);
    });
  }

  getAllAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(`${this.apiUrl}/all`);
  }

  addNewAuthor(author: Omit<Author, 'id'>): Observable<Author> {
    return this.http.post<Author>(this.apiUrl, author);
  }

  getAuthorsByIds(authorIds: number[]): Author[] {
    return this.allAuthors().filter(author => authorIds.includes(author.id));
  }

  getAuthors(): Author[] {
    return this.allAuthors();
  }
}
