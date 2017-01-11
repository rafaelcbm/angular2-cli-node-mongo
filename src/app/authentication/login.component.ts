import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from "@angular/http";

import { AuthHttp, JwtHelper } from "angular2-jwt";

//import { ApiService } from "../shared/api.service";
import "rxjs/add/operator/map";

import {
    ToasterModule,
    ToasterService,
    ToasterConfig
} from 'angular2-toaster/angular2-toaster';

import { AuthService } from './auth.service';

import { Observable } from 'rxjs/Observable';


@Component({
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

    private toasterService: ToasterService;

    public toasterconfig: ToasterConfig =
    new ToasterConfig({
        tapToDismiss: true,
        timeout: 5000
    });

    loginObservable$: Observable<any>;

    username: string;
    password: string;

    constructor(private authService: AuthService, toasterService: ToasterService,
        private router: Router, private http: Http, private authHttp: AuthHttp) {

        this.toasterService = toasterService;
    }

    ngOnInit() {
        // subscribe to the observable
        this.loginObservable$ = this.authService.loginObservable$;
        this.loginObservable$.subscribe((data) => this.loginHandler(data));
    }

    login(formValue) {
        console.log("login.component.login.authService", this.authService);
        this.authService.login(formValue);
    }

    loginHandler(data) {
        if (data.status === "erro") {
            console.log("Mensagem de erro =", data.message);
            //TODO: Encapsular mensagens em novo componente shared
            this.toasterService.pop('error', 'Erro', data.message);
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

    logout(): void {
        this.authService.logout();
    }

    getAllUsersTest() {
        console.log("* Chamou getAllUsersTest:");
     
        this.authHttp
            .get("/api/users/all")
            .map((res: Response) => res.json())
            .subscribe(
            (data) => {
                console.log(data);
            },
            (resError) => {
                console.log(resError);
                //setTimeout(() => this.error = null, 4000)
            });
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
            },
            (resError) => {
                console.log(resError);
                //setTimeout(() => this.error = null, 4000)
            });
    }
}
