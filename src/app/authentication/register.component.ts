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
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

    private toasterService: ToasterService;

    public toasterconfig: ToasterConfig =
        new ToasterConfig({
            tapToDismiss: true,
            timeout: 5000
        });


    registerObservable$: Observable < any > ;

    constructor(private authService: AuthService, toasterService: ToasterService,
        private router: Router, private http: Http, private authHttp: AuthHttp) {

        this.toasterService = toasterService;
    }

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

}
