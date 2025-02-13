import { FormControl, FormGroup } from '@angular/forms';
import { CoverType } from './cover-type.model';
import { AgeGroup } from './age-group.model';

export interface BookForm {
  isbn: FormControl<string | null>;
  title: FormControl<string | null>;
  quantity: FormControl<number | null>;
  publisher: FormControl<string | null>;
  authors: FormControl<number[] | null>;
  imageUrl: FormControl<string | null>;
  publishedDate: FormControl<string | null>;
  bookDetails: FormGroup<{
    pageCount: FormControl<number | null>;
    description: FormControl<string | null>;
    coverType: FormControl<CoverType | null>;
    ageGroup: FormControl<AgeGroup | null>;
  }>;
}
