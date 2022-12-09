import { Component } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor(){
    const firebaseConfig = {
      apiKey: "AIzaSyBBV5GP11FXJh_7iLsm4GBUcY1XkdFHbrQ",
      authDomain: "biblio-angular-3ccc8.firebaseapp.com",
      projectId: "biblio-angular-3ccc8",
      storageBucket: "biblio-angular-3ccc8.appspot.com",
      messagingSenderId: "348771868880",
      appId: "1:348771868880:web:04d00f2bf41a1b07f93ed5",
      measurementId: "G-QWP4HZVTEP"
    };
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
  }
}
