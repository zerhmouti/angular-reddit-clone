import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginRequestPayload } from './login.request.payload';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginForm!: FormGroup;
  loginRequest!: LoginRequestPayload;
  isError!:Boolean;

  constructor(private authService: AuthService, private toastr: ToastrService,
    private activatedRoute:ActivatedRoute, private router: Router ){
    this.loginRequest = {
      username: '',
      password:''
    };
  }

  ngOnInit(): void {
    this.loginForm =new FormGroup({
      username: new FormControl('',Validators.required),
      password: new FormControl('', Validators.required)
    });
    this.activatedRoute.queryParams
        .subscribe(params=>{
            if(params!== undefined && params['registered']=== 'true'){
              this.toastr.success('Signup Successful');
              
            }
        });
  }

  login(){
    this.loginRequest.username = this.loginForm.get('username')?.value ;
    this.loginRequest.password = this.loginForm.get('password')?.value ;
    this.authService.login(this.loginRequest)
    .subscribe({
      next: (value: any)=>{
        if(value){
            this.isError= false;  
            this.router.navigateByUrl('/');
            this.toastr.success('Login successful');
        }else{
          this.isError=true;
        }
      },
    }) 
    console.log(this.loginForm);
  }
}
