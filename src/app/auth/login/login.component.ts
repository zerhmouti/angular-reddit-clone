import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { LoginRequestPayload } from './login.request.payload';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginForm!: FormGroup;
  loginRequest!: LoginRequestPayload;

  constructor(private authService: AuthService){
    this.loginRequest = {
      username: '',
      password:''
    };
  }

  ngOnInit(): void {
    this.loginForm =new FormGroup({
      username: new FormControl('',Validators.required),
      password: new FormControl('', Validators.required)
    })
  }

  login(){
    this.loginRequest.username = this.loginForm.get('username')?.value ;
    this.loginRequest.password = this.loginForm.get('password')?.value ;
    this.authService.login(this.loginRequest)
    .subscribe({
      next: (value)=> console.log(value),
      error: (err)=> console.log(err),
      complete: ()=>{}
    })
    console.log(this.loginForm);
  }
}
