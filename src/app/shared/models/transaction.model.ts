export interface Transaction {
  id: number;
  memberId: number;
  bookId: number;
  borrowedDate: string;
  dueDate: string;
  returnedDate?: string;

  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
}
