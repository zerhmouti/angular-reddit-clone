import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignupRequestPayload } from '../signup/signup-request.payload';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { LoginRequestPayload } from '../login/login.request.payload';
import { LoginResponse } from '../login/login.response';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private headers!:HttpHeaders;
  private baseUrl = "http://localhost:8080/";

  constructor(private http: HttpClient, private localStorage: LocalStorageService,
     private toastr: ToastrService) { }

  signup(signupRequest: SignupRequestPayload): Observable<any>{
    return this.http.post<string>(this.baseUrl.concat("api/auth/signup"),signupRequest);
  }

  login(loginRequest: LoginRequestPayload): Observable<boolean>{
    return this.http.post<LoginResponse>(this.baseUrl.concat("api/auth/login"),loginRequest)
    .pipe(
        map(data=>{
          this.localStorage.store('access_token',data.access_token) ;
          this.localStorage.store('refresh_token', data.refresh_token) ;
          return true;
        }),
        catchError(error =>{
          this.toastr.error('login failed');
          return of(false);
        })
      );  
  }

  public getJwtToken() {
    return this.localStorage.retrieve('access_token');
  }

  public refreshToken(refreshToken:string):Observable<any>{
    this.headers = new HttpHeaders({
      'Authorization': `Bearer${refreshToken}`
    })
    return this.http.post<LoginResponse>(this.baseUrl.concat("api/auth/refresh-token"),null,{headers:this.headers}).pipe(
      tap(response=>{
        this.localStorage.store('refresh_token',response.refresh_token);
        this.localStorage.store('access_token', response.access_token);
        console.log(response);
      })
    );
  }
}
