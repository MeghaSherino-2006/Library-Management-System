import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { BookService } from '../../../core/services/book.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { Book } from '../../../shared/models/book.model';
import { Transaction } from '../../../shared/models/transaction.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatDividerModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  totalBooks = 0;
  totalAvailable = 0;
  borrowedCount = 0;
  overdueCount = 0;

  recentTransactions: Transaction[] = [];
  loading = true;

  constructor(
    private bookService: BookService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;

    // Books
    this.bookService.getBooks().subscribe({
      next: (books: Book[]) => {
        this.totalBooks = books.reduce((sum, b) => sum + b.totalCopies, 0);
        this.totalAvailable = books.reduce((sum, b) => sum + b.availableCopies, 0);
      }
    });

    // Transactions
    this.transactionService.getTransactions().subscribe({
      next: (transactions: Transaction[]) => {
        const now = new Date();

        // Borrowed = status BORROWED only
        const borrowed = transactions.filter(t => t.status === 'BORROWED');
        this.borrowedCount = borrowed.length;

        // Overdue = BORROWED and dueDate < today
        this.overdueCount = borrowed.filter(t => new Date(t.dueDate) < now).length;

        // Recent = latest 5 (by borrowedDate)
        this.recentTransactions = [...transactions]
          .sort((a, b) => new Date(b.borrowedDate).getTime() - new Date(a.borrowedDate).getTime())
          .slice(0, 5);

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
