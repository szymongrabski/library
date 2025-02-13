import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environgment';
import { Author } from '../models/author.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private apiUrl = `${environment.apiUrl}/authors`;
  private allAuthors = signal<Author[]>([]);

  private constructor(private http: HttpClient) {
    this.loadAllAuthors();
  }

  public loadAllAuthors(): void {
    this.http.get<Author[]>(`${this.apiUrl}/all`).subscribe((data) => {
      this.allAuthors.set(data);
    });
  }

  public getAllAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(`${this.apiUrl}/all`);
  }

  public addNewAuthor(author: Omit<Author, 'id'>): Observable<Author> {
    return this.http.post<Author>(this.apiUrl, author);
  }

  public getAuthorsByIds(authorIds: number[]): Author[] {
    return this.allAuthors().filter((author) => authorIds.includes(author.id));
  }

  public getAuthors(): Author[] {
    return this.allAuthors();
  }
}
