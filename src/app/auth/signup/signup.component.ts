import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RoleType, SignupRequestPayload } from './signup-request.payload';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { query } from '@angular/animations';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{

  signupForm!:FormGroup<any>;
  signupRequestPayload: SignupRequestPayload;

  constructor(private authService:AuthService, private toastr:ToastrService, private router:Router){
    this.signupRequestPayload={
      username:'',
      email:'',
      password:'',
      role:'ADMIN'
    };
  }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      username :new FormControl('',Validators.required),
      email: new FormControl('',Validators.email),
      password: new FormControl('', Validators.required),
    })
  }


  signup(){
      this.signupRequestPayload.email= this.signupForm.get('email')?.value;
      this.signupRequestPayload.username = this.signupForm.get('username')?.value;
      this.signupRequestPayload.password = this.signupForm.get('password')?.value;
      this.signupRequestPayload.role="ADMIN";
      console.log(this.signupRequestPayload);
      this.authService.signup(this.signupRequestPayload).subscribe(
        data => {
        this.router.navigate(['/login'],
          { queryParams: { registered: 'true' } });
        },
        error => {
        console.log(error);
        this.toastr.error('Registration Failed! Please try again');
      });
    }

}
