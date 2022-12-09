import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { BooksService } from '../services/books.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuth: boolean = false

  constructor(private authService: AuthService, private booksService: BooksService){}

  ngOnInit(): void {
      onAuthStateChanged(getAuth(), 
        (user)=>{
          if(user){
            this.isAuth = true
          }
          else{
            this.isAuth = false
          }
        })

        // Import books from database
        this.booksService.getBooks()
        this.booksService.emitBooks()
  }

  onSignOut(){
    this.authService.signOut()
  }
}
