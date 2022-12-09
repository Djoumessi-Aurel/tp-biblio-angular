import { Component, Input, OnDestroy, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/models/Book.model';
import { BooksService } from 'src/app/services/books.service';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'

@Component({
  selector: 'app-single-book',
  templateUrl: './single-book.component.html',
  styleUrls: ['./single-book.component.scss']
})
export class SingleBookComponent implements OnInit, OnDestroy {

  @Input() book!: Book
  booksSubscription: Subscription = new Subscription()
  showViewButton: boolean = true //Pour afficher ou non le bouton "Voir"

  constructor(private booksService: BooksService, private router: Router,
    private route: ActivatedRoute, private dialog: MatDialog){}

  ngOnInit(): void {
    
    if(!this.book){ //Si on n'a pas spécifié le livre, alors on regarde la route
      let id = Number(this.route.snapshot.params['id'])
      //console.log(this.route.snapshot.url)
      if(isFinite(id)) {
        
        this.booksSubscription = this.booksService.booksSubject.subscribe(
          (books: Book[])=>{
            let i = books.findIndex((value)=> value.id === id); //console.log('indice', i)
            if(i>=0){
              this.book = books[i]
              this.showViewButton = false
            }
            else this.router.navigate(['/books'])
          }
        )
        this.booksService.emitBooks()
      }
      else this.router.navigate(['/books'])
    }

  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {

    const dialogRef = this.dialog.open(DialogExample, {
      width: '350px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: this.book
    });

    dialogRef.afterClosed().subscribe(
      data => {
        if(data){       //Si on a cliqué sur supprimer alors, on supprimer le livre
          this.onDeleteBook()
        }
      }
  );
  }


  onDeleteBook(){
    this.booksService.removeBook(this.book)
    this.router.navigate(['/books'])
  }

  onViewBook(){
    this.router.navigate(['/books', 'view', this.book.id])
  }

  onEditBook(){
    this.router.navigate(['/books', 'edit', this.book.id])
  }

  ngOnDestroy(): void {
      this.booksSubscription.unsubscribe()
  }

}


@Component({
  selector: 'dialog-example',
  templateUrl: './dialog-example.html',
})
export class DialogExample {
  book!: Book
  constructor(public dialogRef: MatDialogRef<DialogExample>,
    @Inject(MAT_DIALOG_DATA) data: any) {
      this.book = data
      //console.log(data)
    }

  onDelete() {
    this.dialogRef.close("SUPPRIMER"); // On ferme en revoyant "SUPPRIMER"
  }

  onCancel() {
      this.dialogRef.close(); // On ferme en retournant undefined
  }
}