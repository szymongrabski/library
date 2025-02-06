export interface Book {
    readonly id: number;
    readonly isbn: string;
    readonly title: string;
    readonly quantity: number;
    readonly description: string;
    readonly publisherName: string;
    readonly authors: string[];
}
