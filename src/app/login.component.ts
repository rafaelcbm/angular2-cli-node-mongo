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

    nome: string;
    password: string;

    constructor(
        private router: Router, private http: Http, private authHttp: AuthHttp) {}

    login() {
        this.http.post("/login", JSON.stringify({ userName: this.user.username, password: this.user.password }), new RequestOptions({
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

    signup(formValue) {
        if (formValue) { console.log(formValue); }

        this.http.post("/login/signup", JSON.stringify(formValue), new RequestOptions({
                headers: new Headers({ "Content-Type": "application/json" })
            }))
            .map((res: Response) => res.json())
            .subscribe(
                (data: any) => {
                    this.response = data;

                    //localStorage.setItem("id_token", data.jwt);
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
                    console.log(resError.message);
                    this.error = resError._body;
                    //setTimeout(() => this.error = null, 4000)
                });
    }

}
