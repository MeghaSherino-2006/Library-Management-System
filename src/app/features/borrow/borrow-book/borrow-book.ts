import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { Book } from '../../../shared/models/book.model';
import { Member } from '../../../shared/models/member.model';
import { Transaction } from '../../../shared/models/transaction.model';

import { BookService } from '../../../core/services/book.service';
import { MemberService } from '../../../core/services/member.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { futureOrTodayDateValidator } from '../../../shared/validators/date.validators';




@Component({
  selector: 'app-borrow-book',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './borrow-book.html',
  styleUrl: './borrow-book.scss'
})
export class BorrowBook implements OnInit {
  members: Member[] = [];
  books: Book[] = [];

  loading = true;
  errorMsg = '';

  borrowForm!: ReturnType<FormBuilder['group']>;


  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private bookService: BookService,
    private memberService: MemberService,
    private transactionService: TransactionService
) {
  this.borrowForm = this.fb.group({
    memberId: ['', Validators.required],
    bookId: ['', Validators.required],
    dueDate: ['', Validators.required, futureOrTodayDateValidator]
  });
}

private showMessage(message: string, type: 'success' | 'error' = 'success') {
  this.snackBar.open(message, 'Close', {
    duration: 2500,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: type === 'success' ? ['snack-success'] : ['snack-error']
  });
}


  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.memberService.getMembers().subscribe({
      next: (m) => {
        this.members = m;

        this.bookService.getAvailableBooks().subscribe({
          next: (b) => {
            this.books = b;
            this.loading = false;
          },
          error: () => {
            this.errorMsg = 'Failed to load books.';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.errorMsg = 'Failed to load members.';
        this.loading = false;
      }
    });
  }

  performBorrow(): void{
      if (this.borrowForm.invalid) {
      this.borrowForm.markAllAsTouched();
      return;
    }

    const memberId = Number(this.borrowForm.value.memberId);
    const bookId = Number(this.borrowForm.value.bookId);
    const dueDate = new Date(this.borrowForm.value.dueDate as any);

    // Find selected book from list
    const selectedBook = this.books.find((b) => b.id === bookId);
    if (!selectedBook || selectedBook.availableCopies <= 0) {
      alert(' This book is not available.');
      return;
    }

    const transaction: Transaction = {
      id: Date.now(),
      memberId,
      bookId,
      borrowedDate: new Date().toISOString(),
      dueDate: dueDate.toISOString(),
      status: 'BORROWED'
    };

    // 1) reduce availableCopies
const updatedCopies = selectedBook.availableCopies - 1;

this.bookService.updateBook(bookId, { availableCopies: updatedCopies }).subscribe({
  next: () => {
    // 2) add transaction
    this.transactionService.addTransaction(transaction).subscribe({
      next: () => {
        this.showMessage(' Book borrowed successfully!', 'success');
        this.borrowForm.reset();
        this.loadData(); // refresh available books list
      },
      error: () => {
        this.showMessage(' Failed to create transaction', 'error');
      }
    });
  },
  error: () => {
    this.showMessage(' Failed to update book copies', 'error');
  }
});
  }


  borrow(): void {
  if (this.borrowForm.invalid) {
    this.borrowForm.markAllAsTouched();
    return;
  }

  const memberId = Number(this.borrowForm.value.memberId);
  const bookId = Number(this.borrowForm.value.bookId);

  const member = this.members.find(m => m.id === memberId);
  const book = this.books.find(b => b.id === bookId);

  const ref = this.dialog.open(ConfirmDialog, {
    width: '360px',
    data: {
      title: 'Confirm Borrow',
      message: `Borrow "${book?.title}" for ${member?.name}?`,
      confirmText: 'Borrow',
      cancelText: 'Cancel'
    }
  });

  ref.afterClosed().subscribe((confirmed) => {
    if (confirmed) {
      this.performBorrow(); 
    }
  });
}

}
