import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BooksService } from 'src/app/services/books.service';
import { Router } from '@angular/router';
import { Book } from 'src/app/models/Book.model';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit, OnDestroy{

  books: Book[] = []
  booksSubscription!: Subscription

  constructor(private booksService: BooksService, private router: Router){}

  ngOnInit(): void {
    this.booksSubscription = this.booksService.booksSubject.subscribe(
      (books: Book[])=>{
        this.books = books
      }
    )

    this.booksService.emitBooks()      
  }

  onNewBook(){
    this.router.navigate(['/books', 'new'])
  }

  ngOnDestroy(): void {
      this.booksSubscription.unsubscribe()
  }

}
