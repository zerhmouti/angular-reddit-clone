import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, filter, switchMap, throwError, take } from "rxjs";
import { LocalStorageService } from "ngx-webstorage";
import { LoginResponse } from "./auth/login/login.response";
import { AuthService } from "./auth/shared/auth.service";

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
    isTokenRefreshing = false;
    refreshTokenSubject: BehaviorSubject<any>= new BehaviorSubject(null);

    constructor(private authService: AuthService, private localStorage: LocalStorageService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authService.getJwtToken()) {
            req = this.addToken(req, this.authService.getJwtToken());
        }
        return next.handle(req).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse && error.status === 403) {
                    return this.handleAuthErrors(req, next);
                } else {
                    return throwError(error);
                }
            })
        );
    }

    private handleAuthErrors(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('handleAuth');
        if (!this.isTokenRefreshing) {
            this.isTokenRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken(this.localStorage.retrieve('refresh_token')).pipe(
                switchMap((refreshTokenResponse: LoginResponse) => {
                    this.isTokenRefreshing = false;
                    this.refreshTokenSubject.next(refreshTokenResponse.refresh_token);

                    return next.handle(this.addToken(req, refreshTokenResponse.access_token));
                }),
                catchError(error => {
                    this.isTokenRefreshing = false;
                    return throwError(error);
                })
            );
        } else {
            return this.refreshTokenSubject.pipe(
                filter(result => result !== null),
                take(1),
                switchMap(jwt => {
                    return next.handle(this.addToken(req, jwt));
                })
            );
        }
    }

    private addToken(req: HttpRequest<any>, jwtToken: string): HttpRequest<any> {
        return req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + jwtToken)
        });
    }
}