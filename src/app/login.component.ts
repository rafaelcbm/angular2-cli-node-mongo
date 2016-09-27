import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from "@angular/http";

import { AuthHttp, JwtHelper } from "angular2-jwt";

//import { ApiService } from "../shared/api.service";
import "rxjs/add/operator/map";


@Component({
    templateUrl: './login.component.html'
})
export class LoginComponent {

    user: any = {
        password: "angualr2express",
        username: "john"
    };

    response: string;
    error: string;

    constructor(
        private router: Router, private http: Http) {}

    gotoRegister() {
        let link = ['/register'];
        this.router.navigate(link);
    }

    login() {
        this.http.post("/login", JSON.stringify({ password: this.user.password }), new RequestOptions({
                headers: new Headers({ "Content-Type": "application/json" })
            }))
            .map((res: Response) => res.json())
            .subscribe(
                (data: any) => {
                    this.response = data;
                    localStorage.setItem("id_token", data.jwt);
                    // this.myPopup.hide();
                    // this.isLogged = true;
                    // location.reload();
                },
                (error: Error) => { console.log(error); }
            );
    }

    logout(): void {
        localStorage.removeItem("id_token");
        //location.reload();
        // this.isLogged = false;
    }

    protected() {

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


        this.http
            .get("/api")
            .map((res: Response) => res.json())
            .subscribe(
                (data) => {
                    this.response = data;
                },
                (error: Error) => {
                    console.log(error);
                    this.error = error.message;
                    setTimeout(() => this.error = null, 4000)
                });
    }

}
