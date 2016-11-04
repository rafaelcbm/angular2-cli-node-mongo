import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from "@angular/http";

import { AuthHttp, JwtHelper } from "angular2-jwt";

//import { ApiService } from "../shared/api.service";
import "rxjs/add/operator/map";

import { AuthService } from './auth.service';

import { Observable } from 'rxjs/Observable';


@Component({
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

    loginObservable$: Observable<any>;

    // user: any = {
    //     password: "angualr2express",
    //     username: "john"
    // };

    response: string;
    error: string;

    username: string;
    password: string;

    message: string;


    constructor(public authService: AuthService,
        private router: Router, private http: Http, private authHttp: AuthHttp) { 
        this.setMessage();

        console.log("**constructor this.authService.isLoggedIn=", this.authService.isLoggedIn());
    }

    ngOnInit() {

        console.log("**ngOnInit this.authService.isLoggedIn=", this.authService.isLoggedIn());
        // subscribe to the observable
        this.loginObservable$ = this.authService.loginObservable$;      
    }


    setMessage() {
        this.message = 'Logged ' + (this.authService.isLoggedIn() ? 'in' : 'out');
    }

    login() {
        this.message = 'Trying to log in ...';

        /* Exemplo angular.io
        this.authService.login().subscribe(() => {
            this.setMessage();
            if (this.authService.isLoggedIn) {
                // Get the redirect URL from our auth service
                // If no redirect has been set, use the default
                let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : 'main/contas';
                // Redirect the user
                this.router.navigate([redirect]);
            }
        });*/

        this.loginObservable$.subscribe((data) => {
            console.log("Resposta no login.component, data=", data);
            console.log("this.authService.isLoggedIn=", this.authService.isLoggedIn());
            console.log("this.authService.redirectUrl=", this.authService.redirectUrl);
            
            this.setMessage();
            if (this.authService.isLoggedIn()) {
                // Get the redirect URL from our auth service
                // If no redirect has been set, use the default
                let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : 'main/contas';
                // Redirect the user
                this.router.navigate([redirect]);
            }
        })

        this.authService.login();
    }

    signup(formValue) {
        if (formValue) { console.log(formValue); }

        this.http.post("/signup", JSON.stringify(formValue), new RequestOptions({
            headers: new Headers({ "Content-Type": "application/json" })
        }))
            .map((res: Response) => res.json())
            .subscribe(
            (data: any) => {
                console.log("Resposta signup:", data);
                this.response = data;

                //localStorage.setItem("id_token", data.jwt);                    
            },
            (error: Error) => {
                console.log(error);
                this.error = JSON.stringify(error);
            }
            );
    }

    logout(): void {
        
        this.authService.logout();
        this.setMessage();        
        //location.reload();
        // this.isLogged = false;
    }

    protected() {
        console.log("* Chamou protected:");

        let jwtHelper: JwtHelper = new JwtHelper();

        var token = localStorage.getItem('id_token');

        if (token) {
            console.log("* Token utils:");
            console.log(
                jwtHelper.decodeToken(token),
                jwtHelper.getTokenExpirationDate(token),
                jwtHelper.isTokenExpired(token)
            );
        }

        this.authHttp
            .get("/api")
            .map((res: Response) => res.json())
            .subscribe(
            (data) => {
                console.log(data);
                this.response = data;
            },
            (resError) => {
                console.log(resError);
                //setTimeout(() => this.error = null, 4000)
            });
    }
}
