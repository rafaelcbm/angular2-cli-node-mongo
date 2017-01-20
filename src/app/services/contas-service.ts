import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from "@angular/http";

import { AuthHttp } from "angular2-jwt";

import { Conta } from "../models/models.module";

const CONTAS = [
    new Conta("1", 'Conta Conjunta'),
    new Conta("2", 'Cartão - Itaú'),
    new Conta("3", 'Cartão - Santander'),
];

let contasPromise = Promise.resolve(CONTAS);


@Injectable()
export class ContasService {

    constructor(private authHttp: AuthHttp) { }

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
    
    insert(nomeConta) {

        this.authHttp
            .post("/api/contas/", JSON.stringify({ nomeConta: nomeConta }))
            .map((res: Response) => res.json())
            .subscribe(
            data => data,
            error => {
                console.log(error);
                return error;
            });
    }

    remove(idConta) {

        this.authHttp
            .delete(`/api/contas/${idConta}`)
            .map((res: Response) => res.json())
            .subscribe(
            data => data,
            error => {
                console.log(error);
                return error;
            });
    }

    update(idConta, nomeConta) {

        this.authHttp
            .put(`/api/contas/${idConta}`, JSON.stringify({ nomeConta: nomeConta }))
            .map((res: Response) => res.json())
            .subscribe(
            data => data,
            error => {
                console.log(error);
                return error;
            });
    }
    

    getContas() {
        return contasPromise;
    }

    getContasById(id: string) {
        return contasPromise
            .then(contas => contas.find(conta => conta.id === id));
    }
}
