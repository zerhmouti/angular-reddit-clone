import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignupRequestPayload } from '../signup/signup-request.payload';
import { Observable, map } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { LoginRequestPayload } from '../login/login.request.payload';
import { LoginResponse } from '../login/login.response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = "http://localhost:8080/";

  constructor(private http: HttpClient, private localStorage: LocalStorageService) { }

  signup(signupRequest: SignupRequestPayload): Observable<any>{
    return this.http.post(this.baseUrl.concat("api/auth/signup"),signupRequest);
  }

  login(loginRequest: LoginRequestPayload): Observable<boolean>{
    return this.http.post<LoginResponse>(this.baseUrl.concat("api/auth/login"),loginRequest)
    .pipe(
        map(data=>{
          this.localStorage.store('access_token',data.access_token) ;
          this.localStorage.store('refresh_token', data.refresh_token) ;
          return true;
        }));  
  }
}
