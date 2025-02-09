import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environgment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rental } from '../models/rental.model';

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private apiUrl = `${environment.apiUrl}/rentals`;
  private allRentals = signal<Rental[]>([]); 
  private page = signal<number>(0);
  private size = signal<number>(10);

  constructor(private http: HttpClient) {
  }

  loadAllRentals(): void {
    this.http.get<Rental[]>(`${this.apiUrl}`).subscribe(data => {
      this.allRentals.set(data);
    });
  }

  getRentalsByUserId(userId: string): Observable<Rental[]> {
    return this.http.get<Rental[]>(`${this.apiUrl}/user`);
  }

  rentBook(bookId: number): Observable<Rental> {
    return this.http.post<Rental>(`${this.apiUrl}/rent?bookId=${bookId}`, {});
  }

  returnBook(rentalId: number): Observable<Rental> {
    return this.http.post<Rental>(`${this.apiUrl}/return/${rentalId}`, {});
  }

  paginatedRentals(): Rental[] {
    const start = this.page() * this.size();
    return this.allRentals().slice(start, start + this.size());
  }

  totalPages(): number {
    return Math.ceil(this.allRentals().length / this.size());
  }

  currentPage(): number {
    return this.page();
  }

  nextPage(): void {
    if (this.page() < this.totalPages() - 1) {
      this.page.update(p => p + 1);
    }
  }

  prevPage(): void {
    if (this.page() > 0) {
      this.page.update(p => p - 1);
    }
  }

  getRentals(): Rental[] {
    return this.allRentals();
  }

  getRentalById(rentalId: number): Observable<Rental> {
    return this.http.get<Rental>(`${this.apiUrl}/${rentalId}`);
  }
}