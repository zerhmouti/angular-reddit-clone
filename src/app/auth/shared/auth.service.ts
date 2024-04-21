import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignupRequestPayload } from '../signup/signup-request.payload';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = "http://localhost:8080/";

  constructor(private http: HttpClient) { }

  signup(signupRequest: SignupRequestPayload): Observable<any>{
    return this.http.post(this.baseUrl.concat("api/auth/signup"),signupRequest);
  }
}
