import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";

import { tokenNotExpired } from 'angular2-jwt';

import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

@Injectable()
export class AuthService {

    // expose to component
    loginObservable$: Observable<any>;
    private observer: Observer<any>;


    // store the URL so we can redirect after logging in
    redirectUrl: string;

    constructor(private http: Http) {
        this.loginObservable$ = new Observable(observer => this.observer = observer).share();
    }

    isLoggedIn() {
        return tokenNotExpired();
    }

    login(userCredential) {
        //return Observable.of(true).delay(1000).do(val => this.isLoggedIn = true);
        //this.isLoggedIn = true;

        this.http.post("/login", JSON.stringify(userCredential), new RequestOptions({
            headers: new Headers({ "Content-Type": "application/json" })
        }))
            .map((res: Response) => res.json())
            .subscribe(
            (data: any) => {
                console.log("Resposta /login:", data);

                if (data.status === "erro") {
                    // put data into observavle 
                    this.observer.next({
                        jwt: data.msg,
                        status: data.status
                    });
                } else {                    
                    localStorage.setItem("id_token", data.jwt);

                    // put data into observavle 
                    this.observer.next({
                        status: data.status,
                        jwt: data.jwt
                    });
                }
            },
            (error: Error) => {
                console.log(error);
                // put data into observavle  
                this.observer.next({
                    msg: 'Erro ao logar!',
                    status: false
                })
            }
            );
    }

    logout() {
        localStorage.removeItem("id_token");
    }
}
