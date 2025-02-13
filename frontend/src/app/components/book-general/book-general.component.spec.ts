import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookGeneralComponent } from './book-general.component';

describe('BookGeneralComponent', () => {
  let component: BookGeneralComponent;
  let fixture: ComponentFixture<BookGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookGeneralComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
