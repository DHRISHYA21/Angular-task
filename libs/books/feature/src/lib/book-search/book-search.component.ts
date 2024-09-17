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
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
  providers: [DatePipe]
})
export class BookSearchComponent implements OnInit {
  books: ReadingListBook[];

  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private readonly datePipe: DatePipe // Inject DatePipe
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.store.select(getAllBooks).subscribe(books => {
      this.books = books;
      
    });
       // Instant search with valueChanges
       this.searchForm.controls.term.valueChanges.pipe(
        debounceTime(300), // Wait 300ms after user stops typing
        distinctUntilChanged() // Only search if the term has changed
      ).subscribe(term => {
        if (term) {
          this.store.dispatch(searchBooks({ term })); // Dispatch search action
        } else {
          this.store.dispatch(clearSearch()); // Clear search if input is empty
        }
      });
  }

  formatDate(date: string | undefined) {
    return date
      ? this.datePipe.transform(new Date(date), 'MM/dd/yyyy') // Format date using DatePipe
      : undefined;
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
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
