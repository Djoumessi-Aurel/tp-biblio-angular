import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Book } from '../models/Book.model';
import {getDatabase, ref, set, onValue, get} from 'firebase/database'

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private books: Book[] = []
  booksSubject = new Subject<Book[]>()
  booksRef = ref(getDatabase(), '/books') //Référence de l'emplacement où on stocke les livres

  constructor() { }

  emitBooks(){
    this.booksSubject.next(this.books)
  }

  getLastBookId(){
    let max = this.books.length - 1
    if(max===-1) return 0   // Si le tableau est vide...
    else{
      return this.books[max].id
    }
  }

  saveBooks(){ console.log(this.booksRef)
    set(this.booksRef, this.books)
  }

  getBooks(){
    onValue(this.booksRef, (snapshot) => {
      const data = snapshot.val();
      this.books = data ? data : []
      this.emitBooks()
    });
  }

  getSingleBook(id: number){
    return new Promise((resolve, reject)=>{

      get(ref(getDatabase(), '/books/' + id)).then((snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        reject(error);
      });
    })
  }

  createNewBook(newBook: Book){
    this.books.push(newBook)
    this.saveBooks()
    this.emitBooks()
  }

  updateBook(a_book: Book){
    let index = this.books.findIndex((value)=> value.id === a_book.id)
    if(index===-1) return
    
    this.books[index] = a_book
    this.saveBooks()
    this.emitBooks()
  }

  removeBook(a_book: Book){
    let index = this.books.findIndex((value)=> value.id === a_book.id)
    if(index===-1) return

    this.books.splice(index, 1) //Retire l'élément à l'indice demandé
    this.saveBooks()
    this.emitBooks()
  }
}
