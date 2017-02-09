import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from "@angular/http";

import { AuthHttp } from "angular2-jwt";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

import { Lancamento } from "../models/models.module";



@Injectable()
export class LancamentosService {

    lancamentos: Observable < Lancamento[] > ;
    private _lancamentos: BehaviorSubject < Lancamento[] > ;
    private lancamentosStore: {
        lancamentos: Lancamento[]
    };

    constructor(private authHttp: AuthHttp) {
        this.lancamentosStore = { lancamentos: [] };
        this._lancamentos = < BehaviorSubject < Lancamento[] >> new BehaviorSubject([]);
        this.lancamentos = this._lancamentos.asObservable();
    }

    getAllLancamentos() {
        this.authHttp
            .get("/api/lancamentos/")
            .map((res: Response) => res.json())
            .subscribe(
                data => {
                    console.log("Data return on service:", data);

                    if (data.status === "sucesso") {
                        this.lancamentosStore.lancamentos = data.lancamentos;
                        this._lancamentos.next(Object.assign({}, this.lancamentosStore).lancamentos);
                    }
                },
                error => {
                    console.log(error);
                });
    }

    getLancamentosById(id: string) {
        console.log("no service id=", id);
        console.log("no service this.lancamentosStore=", this.lancamentosStore);
        //TODO: tentar obtendo do observer do service com o find, sem ter q fezer outra chamada ao backend
    }

    getAll() {

        return this.authHttp
            .get("/api/lancamentos/")
            .map((res: Response) => res.json())
            .subscribe(
                data => data,
                error => {
                    console.log(error);
                    return error;
                });
    }

    create(nomeLancamento) {

        this.authHttp
            .post("/api/lancamentos/", JSON.stringify({ nomeLancamento: nomeLancamento }))
            .map((res: Response) => res.json())
            .subscribe(
                data => {
                    if (data.status === "sucesso") {
                        this.lancamentosStore.lancamentos.push(data.lancamento);
                    }
                    this._lancamentos.next(Object.assign({}, this.lancamentosStore).lancamentos);
                },
                error => {
                    console.log(error);
                });
    }

    remove(idLancamento) {

        this.authHttp
            .delete(`/api/lancamentos/${idLancamento}`)
            .map((res: Response) => res.json())
            .subscribe(
                data => {
                    if (data.status === "sucesso") {
                        this.lancamentosStore.lancamentos.forEach((c, i) => {
                            if (c._id === idLancamento) {
                                this.lancamentosStore.lancamentos.splice(i, 1);
                            }
                        });
                        this._lancamentos.next(Object.assign({}, this.lancamentosStore).lancamentos);
                    }
                },
                error => {
                    console.log(error);
                });
    }

    update(idLancamento, nomeLancamento) {

        this.authHttp
            .put(`/api/lancamentos/${idLancamento}`, JSON.stringify({ nomeLancamento: nomeLancamento }))
            .map((res: Response) => res.json())
            .subscribe(
                data => {
                    if (data.status === "sucesso") {
                        this.lancamentosStore.lancamentos.forEach((c, i) => {
                            if (c._id === data.lancamento._id) {
                                this.lancamentosStore.lancamentos[i] = data.lancamento;
                            }
                        });
                        this._lancamentos.next(Object.assign({}, this.lancamentosStore).lancamentos);
                    }
                },
                error => {
                    console.log(error);
                });
    }


    // getLancamentos() {
    //     return lancamentosPromise;
    // }

    // getLancamentosById(id: string) {
    //     return lancamentosPromise
    //         .then(lancamentos => lancamentos.find(lancamento => lancamento.id === id));
    // }
}
