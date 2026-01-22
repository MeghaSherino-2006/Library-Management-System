import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { Book } from '../../../shared/models/book.model';
import { BookService } from '../../../core/services/book.service';

import { TransactionService } from '../../../core/services/transaction.service';
 import { ITransaction } from '../../../shared/models/transaction.model';


@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.scss'
})
export class BookDetail implements OnInit {
  book?: Book;
  loading = true;
  errorMsg = '';

  constructor(
  private route: ActivatedRoute,
  private bookService: BookService,
  private transactionService: TransactionService
) {}


  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.bookService.getById(id).subscribe({
      next: (data) => {
        this.book = data;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Book not found!';
        this.loading = false;
      }
    });
  }

  borrowBook(): void {
  if (!this.book || this.book.availableCopies === 0) return;

  const borrowedDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(borrowedDate.getDate() + 14); // 14 days due



const transaction: ITransaction = {
  id: Date.now(),
  memberId: 1,
  bookId: this.book.id,
  borrowedDate: borrowedDate.toISOString(),
  dueDate: dueDate.toISOString(),
  status: 'BORROWED'
};


  const updatedCopies = this.book.availableCopies - 1;

  this.bookService.updateBook(this.book.id, { availableCopies: updatedCopies }).subscribe({
    next: () => {

      this.transactionService.add(transaction).subscribe({
        next: () => {
          alert(' Book borrowed successfully!');
          this.book!.availableCopies = updatedCopies;
        },
        error: () => alert(' Failed to create transaction')
      });
    },
    error: () => alert(' Failed to update book copies')
  });
}

}
