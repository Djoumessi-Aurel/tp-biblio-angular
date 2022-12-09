import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { BookFormComponent } from './books/book-form/book-form.component';
import { BookListComponent } from './books/book-list/book-list.component';
import { SingleBookComponent } from './books/single-book/single-book.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ConnectedUserGuardService } from './services/connected-user-guard.service';

const routes: Routes = [
  {path: 'auth/signup', canActivate: [ConnectedUserGuardService], component: SignupComponent},
  {path: 'auth/signin', canActivate: [ConnectedUserGuardService], component: SigninComponent},
  
  {path: 'books', canActivate: [AuthGuardService], component: BookListComponent},
  {path: 'books/view/:id', canActivate: [AuthGuardService], component: SingleBookComponent},
  {path: 'books/new', canActivate: [AuthGuardService], component: BookFormComponent},
  {path: 'books/edit/:id', canActivate: [AuthGuardService], component: BookFormComponent},
  {path: '**', redirectTo: 'auth/signin'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
