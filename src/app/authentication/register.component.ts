import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from "@angular/http";

//import { AuthHttp } from "angular2-jwt";
import "rxjs/add/operator/map";

import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';


@Component({
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {


    registerObservable$: Observable < any > ;

    constructor(private authService: AuthService, private router: Router, private http: Http
        //, private authHttp: AuthHttp
        ) {    }

    ngOnInit() {
        // subscribe to the observable
        this.registerObservable$ = this.authService.registerObservable$;
        this.registerObservable$.subscribe((data) => this.signupHandler(data));
    }

    signup(formValue) {
        this.authService.signup(formValue);
    }

    signupHandler(data) {
        if (data.status === "erro") {
            console.log("Mensagem de erro =", data.message);            
            return;
        }

        if (this.authService.isLoggedIn()) {
            // Get the redirect URL from our auth service
            // If no redirect has been set, use the default
            let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : 'main/contas';
            // Redirect the user
            this.router.navigate([redirect]);
        }
    }

}
