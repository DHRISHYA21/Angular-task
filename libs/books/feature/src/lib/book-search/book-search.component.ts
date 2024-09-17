import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
  providers: [DatePipe]
})
export class BookSearchComponent implements OnInit {
  books: ReadingListBook[];
  previousBooks: ReadingListBook[];

  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private readonly datePipe: DatePipe, // Inject DatePipe
    private readonly snackBar: MatSnackBar
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.store.select(getAllBooks).subscribe(books => {
      this.books = books;
    });
  }

  formatDate(date: string | undefined) {
    return date
      ? this.datePipe.transform(new Date(date), 'MM/dd/yyyy') // Format date using DatePipe
      : undefined;
  }

  addBookToReadingList(book: Book) {
    this.previousBooks = [...this.books]; // Save current state for undo  
    this.store.dispatch(addToReadingList({ book }));  

    // Open Snackbar with Undo action  
    const snackBarRef = this.snackBar.open(`Added "${book.title}" to reading list`, 'Undo', {  
      duration: 3000,  
    });

    // Handle the Undo action  
    snackBarRef.onAction().subscribe(() => {  
      this.books = [...this.previousBooks]; 
    });
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }
}
