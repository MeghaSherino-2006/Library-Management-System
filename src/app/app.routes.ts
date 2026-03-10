import { Routes } from '@angular/router';
import { BookList } from './features/books/book-list/book-list';
import { BookDetail } from './features/books/book-detail/book-detail';
import { ReturnBook } from './features/return/return-book/return-book';
import { BorrowBook } from './features/borrow/borrow-book/borrow-book';
import { MemberList } from './features/members/member-list/member-list';
import { MemberAdd } from './features/members/member-add/member-add';
import { Dashboard } from './features/dashboard/dashboard/dashboard';





export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  { path: 'dashboard', component: Dashboard },

  { path: 'books', component: BookList },
  { path: 'books/:id', component: BookDetail },

  { path: 'borrow', component: BorrowBook },
  { path: 'return', component: ReturnBook },

  { path: 'members', component: MemberList },
  { path: 'members/add', component: MemberAdd },

  { path: '**', redirectTo: 'dashboard' }
];

