import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environgment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rental } from '../models/rental.model';

@Injectable({
  providedIn: 'root',
})
export class RentalService {
  private apiUrl = `${environment.apiUrl}/rentals`;
  private allRentals = signal<Rental[]>([]);
  private page = signal<number>(0);
  private size = signal<number>(10);

  private constructor(private http: HttpClient) {}

  public loadAllRentals(): void {
    this.http.get<Rental[]>(`${this.apiUrl}`).subscribe((data) => {
      this.allRentals.set(data.sort((a, b) => b.id - a.id));
    });
  }

  public getRentalsByUserId(): Observable<Rental[]> {
    return this.http.get<Rental[]>(`${this.apiUrl}/user`);
  }

  public rentBook(bookId: number): Observable<Rental> {
    return this.http.post<Rental>(`${this.apiUrl}/rent?bookId=${bookId}`, {});
  }

  public returnBook(rentalId: number): Observable<Rental> {
    return this.http.post<Rental>(`${this.apiUrl}/return/${rentalId}`, {});
  }

  public approveRental(rentalId: number): Observable<Rental> {
    return this.http.post<Rental>(`${this.apiUrl}/approve/${rentalId}`, {});
  }

  public deleteRental(rentalId: number): Observable<Rental> {
    return this.http.delete<Rental>(`${this.apiUrl}/${rentalId}`, {});
  }

  public paginatedRentals(): Rental[] {
    const start = this.page() * this.size();

    return this.allRentals().slice(start, start + this.size());
  }

  public totalPages(): number {
    return Math.ceil(this.allRentals().length / this.size());
  }

  public currentPage(): number {
    return this.page();
  }

  public nextPage(): void {
    if (this.page() < this.totalPages() - 1) {
      this.page.update((p) => p + 1);
    }
  }

  public prevPage(): void {
    if (this.page() > 0) {
      this.page.update((p) => p - 1);
    }
  }

  public getRentals(): Rental[] {
    return this.allRentals();
  }

  public getRentalById(rentalId: number): Observable<Rental> {
    return this.http.get<Rental>(`${this.apiUrl}/${rentalId}`);
  }
}
