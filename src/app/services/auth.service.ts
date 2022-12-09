import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  signOut} from "firebase/auth";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth = getAuth()
  
  constructor() { }

  createNewUser(email: string, password: string){
    return new Promise((resolve, reject)=>{
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          resolve(user)
        })
        .catch((error) => {
          reject(error)
        });
    })
  }

  signIn(email: string, password: string){
    return new Promise((resolve, reject)=>{
      signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          resolve(user)
        })
        .catch((error) => {
          reject(error)
        });
    })
  }

  signOut(){
    signOut(this.auth)
  }
}
