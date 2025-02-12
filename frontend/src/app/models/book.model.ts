import { AgeGroup } from './age-group.model';
import { CoverType } from './cover-type.model';

export interface Book {
  readonly id: number;
  readonly isbn: string;
  readonly title: string;
  readonly quantity: number;
  readonly publisherName: string;
  readonly imageUrl: string;
  readonly authors: number[];
  readonly publishedDate: string;

  readonly bookDetails: {
    readonly pageCount: number;
    readonly description: string;
    readonly coverType: CoverType;
    readonly ageGroup: AgeGroup;
  };
}
