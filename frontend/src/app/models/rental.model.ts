export interface Rental {
    readonly id: number;
    readonly bookId: number;
    readonly userId: number;
    readonly rentalDate: string;
    readonly returnDate: string,
    readonly status: string;
}