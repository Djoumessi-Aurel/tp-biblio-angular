import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})

/* Ce service a pour rôle d'empêcher un utilisateur déjà authentifié 
    d'accéder aux pages d'inscription et de connexion */
export class ConnectedUserGuardService implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return new Promise((resolve, reject)=>{
      onAuthStateChanged(getAuth(),
      (user)=>{
        if(user){
          this.router.navigate(['/books']) //Si l'utilisateur est déjà connecté, on le ramène à la page des livres
          resolve(false)
        }
        else{
          resolve(true)
        }
      })
    })
}
}
