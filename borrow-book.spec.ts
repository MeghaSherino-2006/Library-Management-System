import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowBook } from './borrow-book';

describe('BorrowBook', () => {
  let component: BorrowBook;
  let fixture: ComponentFixture<BorrowBook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowBook]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowBook);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
