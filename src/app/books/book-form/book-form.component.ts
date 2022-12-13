import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/models/Book.model';
import { BooksService } from 'src/app/services/books.service';
import {Subscription} from 'rxjs'

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnInit, OnDestroy{

  book: Book = new Book(-1, '', '', '') //Valeur par défaut pour le formulaire d'ajout
  booksSubscription: Subscription = new Subscription()
  fileIsUploading: boolean = false
  fileUrl: string | undefined
  fileUploaded: boolean = false

  constructor(private booksService: BooksService, private router: Router,
    private route: ActivatedRoute){}

  ngOnInit(): void {

    if(this.route.snapshot.params['id']===undefined) return //On est sur la page d'ajout de livre

    let id = Number(this.route.snapshot.params['id'])
      
      if(isFinite(id)) {
        
        this.booksSubscription = this.booksService.booksSubject.subscribe(
          (books: Book[])=>{
            let i = books.findIndex((value)=> value.id === id);
            if(i>=0){
              this.book = books[i] //On est sur la page de modification du livre
              this.fileUrl = this.book.photo
            }
            else this.router.navigate(['/books'])
          }
        )
        this.booksService.emitBooks()
      }
      else this.router.navigate(['/books'])
  }

  onNewBook(){
    this.router.navigate(['/books', 'new'])
  }

  ngOnDestroy(): void {
      this.booksSubscription.unsubscribe()
  }

  onSubmit(f: NgForm){
    
    let a_book = new Book(this.book.id, f.value['title'], f.value['author'], f.value['year'])

    if(this.fileUrl && this.fileUrl !== ''){
      a_book.photo = this.fileUrl
    }
    //console.log(a_book)

    if(this.book.id===-1){ //Ajout d'un nouveau livre
      a_book.id = this.booksService.getLastBookId() + 1
      this.booksService.createNewBook(a_book)
    }
    else{ //Modification d'un livre
      this.booksService.updateBook(a_book)
    }

    this.router.navigate(['/books'])
  }

  onUploadFile(file: File){ //Uploade un fichier dans le cloud
    this.fileIsUploading = true
    this.booksService.uploadFile(file)
      .then((url: string)=>{ //Lorsque l'upload est fini
        this.fileUrl = url
        this.fileIsUploading = false
        this.fileUploaded = true
      })
      .catch(()=>{ //Lorsque l'upload échoue
        this.fileUrl = ''
        this.fileIsUploading = false
        this.fileUploaded = false
      })
  }

  detectFiles(event: any){
    this.onUploadFile(event.target.files[0])
  }
}
