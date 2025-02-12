import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookFilterPanelComponent } from './book-filter-panel.component';

describe('BookFilterPanelComponent', () => {
  let component: BookFilterPanelComponent;
  let fixture: ComponentFixture<BookFilterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookFilterPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookFilterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
