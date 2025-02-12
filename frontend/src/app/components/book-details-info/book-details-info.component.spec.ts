import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDetailsInfoComponent } from './book-details-info.component';

describe('BookDetailsInfoComponent', () => {
  let component: BookDetailsInfoComponent;
  let fixture: ComponentFixture<BookDetailsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookDetailsInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookDetailsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
