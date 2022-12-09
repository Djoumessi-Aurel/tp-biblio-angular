import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit{

  signUpForm!: FormGroup
  errorMessage: string = ''

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router){}

  ngOnInit(): void {
      this.initForm()
  }

  initForm(){
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[\w\d]{6,}/)]],
    })
  }

  onSubmit(){
    const email = this.signUpForm.value['email']
    const password = this.signUpForm.value['password']

    this.authService.createNewUser(email, password)
      .then((user)=>{
        console.log(user)
        this.router.navigate(['/books'])
      })
      .catch((error)=>{
        this.errorMessage = error.message
      })
  }
}
