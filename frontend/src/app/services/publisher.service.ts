import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environgment';
import { HttpClient } from '@angular/common/http';
import { Publisher } from '../models/publisher.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {
  private apiUrl = `${environment.apiUrl}/publishers`;
  private allPublishers = signal<Publisher[]>([]);

  constructor(private http: HttpClient) { }

  loadAllPublishers(): void {
    this.http.get<Publisher[]>(`${this.apiUrl}/all`).subscribe(data => {
      this.allPublishers.set(data);
    });
  }

  getAllPublishers(): Observable<Publisher[]> {
    return this.http.get<Publisher[]>(`${this.apiUrl}/all`);
  }

  addNewPublisher(publisher: Omit<Publisher, 'id'>): Observable<Publisher> {
    return this.http.post<Publisher>(this.apiUrl, publisher);
  }
}
