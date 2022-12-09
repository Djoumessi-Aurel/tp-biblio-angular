import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      return new Promise((resolve, reject)=>{
        onAuthStateChanged(getAuth(),
        (user)=>{
          if(user){
            resolve(true)
          }
          else{
            this.router.navigate(['/auth', 'signin']) //Lorsque l'utilisateur se déconnecte, on le ramène à la page de connexion
            resolve(false)
          }
        })
      })
  }
}
