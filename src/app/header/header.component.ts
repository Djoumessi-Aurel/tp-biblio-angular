import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { getAuth, onAuthStateChanged} from "firebase/auth";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuth: boolean = false

  constructor(private authService: AuthService){}

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

  }

  onSignOut(){
    this.authService.signOut()
  }
}
