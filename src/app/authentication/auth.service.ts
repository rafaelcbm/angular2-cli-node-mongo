import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";

import { tokenNotExpired } from 'angular2-jwt';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

@Injectable()
export class AuthService {

    // expose to component
    loginObservable$: Observable < any > ;
    registerObservable$: Observable < any > ;

    private loginObserver: Observer < any > ;
    private registerObserver: Observer < any > ;


    // store the URL so we can redirect after logging in
    redirectUrl: string;

    constructor(private http: Http) {
        this.loginObservable$ = new Observable(observer => this.loginObserver = observer).share();
        this.registerObservable$ = new Observable(observer => this.registerObserver = observer).share();
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
                        this.loginObserver.next({
                            errorMsg: data.msg,
                            status: data.status
                        });
                    } else {
                        localStorage.setItem("id_token", data.jwt);

                        // put data into observavle 
                        this.loginObserver.next({
                            status: data.status,
                            jwt: data.jwt
                        });
                    }
                },
                (error: Error) => {
                    console.log(error);
                    // put data into observavle  
                    this.loginObserver.next({
                        errorMsg: 'Erro ao logar!',
                        status: 'erro'
                    })
                }
            );
    }

    signup(userCredential) {
        //return Observable.of(true).delay(1000).do(val => this.isLoggedIn = true);
        //this.isLoggedIn = true;

        this.http.post("/signup", JSON.stringify(userCredential), new RequestOptions({
                headers: new Headers({ "Content-Type": "application/json" })
            }))
            .map((res: Response) => res.json())
            .subscribe(
                (data: any) => {
                    console.log("Resposta / register:", data);

                    if (data.status === "erro") {
                        // put data into observavle 
                        this.registerObserver.next({
                            errorMsg: data.msg,
                            status: data.status
                        });
                    } else {
                        localStorage.setItem("id_token", data.jwt);

                        // put data into observavle 
                        this.registerObserver.next({
                            status: data.status,
                            jwt: data.jwt
                        });
                    }
                },
                (error: Error) => {
                    console.log(error);
                    // put data into observavle  
                    this.registerObserver.next({
                        errorMsg: 'Erro ao registrar novo usuário!',
                        status: 'erro'
                    })
                }
            );
    }

    logout() {
        localStorage.removeItem("id_token");
    }
}
