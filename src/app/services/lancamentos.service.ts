import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from "@angular/http";

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import * as moment from 'moment';

import { NotificacaoService } from '../services/notificacao.service';
import { ApiHttpService } from './api-http.service';
import { AuthService } from '../authentication/auth.service';
import { Lancamento } from "../models/models.module";


@Injectable()
export class LancamentosService {

    lancamentos: Observable<Lancamento[]>;
    private _lancamentos: BehaviorSubject<Lancamento[]>;
    private lancamentosStore: {
        lancamentos: Lancamento[]
    };

    constructor(private apiHttp: ApiHttpService, private notificacaoService: NotificacaoService) {
        this.lancamentosStore = { lancamentos: [] };
        this._lancamentos = <BehaviorSubject<Lancamento[]>>new BehaviorSubject([]);
        this.lancamentos = this._lancamentos.asObservable();
    }

    getAllLancamentos() {

        this.apiHttp.get("/api/lancamentos/")
            .subscribe(
            data => {
                console.log("Data return on service:", data);

                if (data.status === "sucesso") {

                    if(data.lancamentos){
                        // Formata a data do objeto de Date para String
                        data.lancamentos.map(lancamento => lancamento.data = moment(lancamento.data).format('DD/MM/YYYY'));                        
                    }

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

        return this.apiHttp
            .get("/api/lancamentos/")
            .subscribe(
            data => data,
            error => {
                console.log(error);
                return error;
            });
    }

    create(lancamento) {

        this.apiHttp
            .post("/api/lancamentos/", { lancamento: lancamento })
            .subscribe(
            data => {
                if (data.status === "sucesso") {

                    // Formata a data do objeto de Date para String
                    data.lancamento.data = moment(data.lancamento.data).format('DD/MM/YYYY');

                    this.lancamentosStore.lancamentos.push(data.lancamento);
                    this._lancamentos.next(Object.assign({}, this.lancamentosStore).lancamentos);

                    this.notificacaoService.sendSucessMessage(`Lancamento "${lancamento.descricao}" salvo com sucesso.`);
                } else if (data.status === "erro") {
                    console.log(data.message);
                    this.notificacaoService.sendErrorMessage(data.message);
                }
            },
            error => {
                console.log(error);
            });
    }

    remove(idLancamento) {

        this.apiHttp
            .delete(`/api/lancamentos/${idLancamento}`)
            .subscribe(
            data => {
                if (data.status === "sucesso") {
                    this.lancamentosStore.lancamentos.forEach((l, i) => {
                        if (l._id === idLancamento) {
                            this.lancamentosStore.lancamentos.splice(i, 1);
                        }
                    });
                    this._lancamentos.next(Object.assign({}, this.lancamentosStore).lancamentos);

                    this.notificacaoService.sendSucessMessage('Lancamento removido com sucesso.');
                } else if (data.status === "erro") {
                    console.log(data.message);
                    this.notificacaoService.sendErrorMessage(data.message);
                }
            },
            error => {
                console.log(error);
            });
    }

    update(idLancamento, lancamento) {

        this.apiHttp
            .put(`/api/lancamentos/${idLancamento}`, { lancamento: lancamento })
            .subscribe(
            data => {
                if (data.status === "sucesso") {
                    this.lancamentosStore.lancamentos.forEach((l, i) => {
                        if (l._id === data.lancamento._id) {

                            // Formata a data do objeto de Date para String
                            data.lancamento.data = moment(data.lancamento.data).format('DD/MM/YYYY');

                            this.lancamentosStore.lancamentos[i] = data.lancamento;
                        }
                    });
                    this._lancamentos.next(Object.assign({}, this.lancamentosStore).lancamentos);

                    this.notificacaoService.sendSucessMessage(`Lancamento "${lancamento.descricao}" salvo com sucesso.`);

                } else if (data.status === "erro") {
                    console.log(data.message);
                    this.notificacaoService.sendErrorMessage(data.message);
                }
            },
            error => {
                console.log(error);
            });
    }
}
