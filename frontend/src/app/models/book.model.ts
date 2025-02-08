export interface Book {
    readonly id: number;
    readonly isbn: string;
    readonly title: string;
    readonly quantity: number;
    readonly description: string;
    readonly publisherName: string;
    readonly imageUrl: string;
    readonly authors: number[];
    readonly publishedDate: string;
}
