import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";

import { AuthHttp,JwtHelper } from "angular2-jwt";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

import { Conta } from "../models/models.module";
import { AuthService }      from '../authentication/auth.service';

// const CONTAS = [
//     new Conta("1", 'Conta Conjunta'),
//     new Conta("2", 'Cartão - Itaú'),
//     new Conta("3", 'Cartão - Santander'),
// ];

// let contasPromise = Promise.resolve(CONTAS);


@Injectable()
export class ContasService {

    contas: Observable < Conta[] > ;
    private _contas: BehaviorSubject < Conta[] > ;
    private contasStore: {
        contas: Conta[]
    };

    constructor(private authHttp: Http, private authService:AuthService) {
        this.contasStore = { contas: [] };
        this._contas = < BehaviorSubject < Conta[] >> new BehaviorSubject([]);
        this.contas = this._contas.asObservable();
    }

    getAllContas() {
        console.log("authService.isLoggedIn() = ", this.authService.isLoggedIn());

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
            .get("/api/contas/", new RequestOptions({
                headers: new Headers({ "Content-Type": "application/json", "authorization": token })
            }))
            .map((res: Response) => res.json())
            .subscribe(
                data => {
                    console.log("Data return on service:", data);

                    if (data.status === "sucesso") {
                        this.contasStore.contas = data.contas;
                        this._contas.next(Object.assign({}, this.contasStore).contas);
                    }
                },
                error => {
                    console.log(error);
                });
    }

    getContasById(id: string) {
        console.log("no service id=", id);
        console.log("no service this.contasStore=", this.contasStore);
        //TODO: tentar obtendo do observer do service com o find, sem ter q fezer outra chamada ao backend
    }

    getAll() {

        return this.authHttp
            .get("/api/contas/")
            .map((res: Response) => res.json())
            .subscribe(
                data => data,
                error => {
                    console.log(error);
                    return error;
                });
    }

    create(nomeConta) {

        this.authHttp
            .post("/api/contas/", JSON.stringify({ nomeConta: nomeConta }))
            .map((res: Response) => res.json())
            .subscribe(
                data => {
                    if (data.status === "sucesso") {
                        this.contasStore.contas.push(data.conta);
                    }
                    this._contas.next(Object.assign({}, this.contasStore).contas);
                },
                error => {
                    console.log(error);
                });
    }

    remove(idConta) {

        this.authHttp
            .delete(`/api/contas/${idConta}`)
            .map((res: Response) => res.json())
            .subscribe(
                data => {
                    if (data.status === "sucesso") {
                        this.contasStore.contas.forEach((c, i) => {
                            if (c._id === idConta) {
                                this.contasStore.contas.splice(i, 1);
                            }
                        });
                        this._contas.next(Object.assign({}, this.contasStore).contas);
                    }
                },
                error => {
                    console.log(error);
                });
    }

    update(idConta, nomeConta) {

        this.authHttp
            .put(`/api/contas/${idConta}`, JSON.stringify({ nomeConta: nomeConta }))
            .map((res: Response) => res.json())
            .subscribe(
                data => {
                    if (data.status === "sucesso") {
                        this.contasStore.contas.forEach((c, i) => {
                            if (c._id === data.conta._id) {
                                this.contasStore.contas[i] = data.conta;
                            }
                        });
                        this._contas.next(Object.assign({}, this.contasStore).contas);
                    }
                },
                error => {
                    console.log(error);
                });
    }


    // getContas() {
    //     return contasPromise;
    // }

    // getContasById(id: string) {
    //     return contasPromise
    //         .then(contas => contas.find(conta => conta.id === id));
    // }
}
