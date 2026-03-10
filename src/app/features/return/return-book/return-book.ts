import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { Transaction } from '../../../shared/models/transaction.model';
import { TransactionService } from '../../../core/services/transaction.service';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../shared/models/book.model';

import { forkJoin } from 'rxjs';
import { MemberService } from '../../../core/services/member.service';


type ReturnView = Transaction & {
  bookTitle?: string;
  memberName?: string;
  overdue?: boolean;
};

@Component({
  selector: 'app-return-book',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './return-book.html',
  styleUrl: './return-book.scss'
})


export class ReturnBook implements OnInit {
  borrowedTransactions: ReturnView[] = [];
  loading = true;
  errorMsg = '';

 constructor(
  private transactionService: TransactionService,
  private bookService: BookService,
  private memberService: MemberService
) {}


  ngOnInit(): void {
    this.loadBorrowedTransactions();
  }

  loadBorrowedTransactions(): void {
  this.loading = true;

  this.transactionService.getBorrowedTransactions().subscribe({
    next: (transactions) => {
      if (transactions.length === 0) {
        this.borrowedTransactions = [];
        this.loading = false;
        return;
      }

      // For each transaction, fetch book + member
      const enrichedCalls = transactions.map((t) =>
        forkJoin({
          book: this.bookService.getBookById(t.bookId),
          member: this.memberService.getMemberById(t.memberId)
        })
      );

      forkJoin(enrichedCalls).subscribe({
        next: (results) => {
          this.borrowedTransactions = transactions.map((t, i) => {
            const due = new Date(t.dueDate);
            const now = new Date();
            const isOverdue = due < now;

            return {
              ...t,
              bookTitle: results[i].book.title,
              memberName: results[i].member.name,
              overdue: isOverdue
            };
          });

          this.loading = false;
        },
        error: () => {
          this.errorMsg = 'Failed to load book/member details.';
          this.loading = false;
        }
      });
    },
    error: () => {
      this.errorMsg = 'Failed to load borrowed books.';
      this.loading = false;
    }
  });
}


  returnBook(transaction: Transaction): void {
    // step 1: get book details
    this.bookService.getBookById(transaction.bookId).subscribe({
      next: (book: Book) => {
        const updatedCopies = book.availableCopies + 1;

        // step 2: update book available copies
        this.bookService.updateBook(book.id, { availableCopies: updatedCopies }).subscribe({
          next: () => {
            // step 3: update transaction
            this.transactionService.updateTransaction(transaction.id, {
              status: 'RETURNED',
              returnedDate: new Date().toISOString()
            }).subscribe({
              next: () => {
                alert(' Book returned successfully!');
                this.loadBorrowedTransactions(); // refresh list
              },
              error: () => alert(' Failed to update transaction')
            });
          },
          error: () => alert(' Failed to update book copies')
        });
      },
      error: () => alert(' Book not found')
    });
  }
}
