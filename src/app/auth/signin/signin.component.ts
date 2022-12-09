import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {

  signInForm!: FormGroup
  errorMessage: string = ''

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router){}

  ngOnInit(): void {
      this.initForm()
  }

  initForm(){
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  onSubmit(){
    const email = this.signInForm.value['email']
    const password = this.signInForm.value['password']

    this.authService.signIn(email, password)
      .then((user)=>{
        console.log(user)
        this.router.navigate(['/books'])
      })
      .catch((error)=>{
        this.errorMessage = error.message
      })
  }
}
