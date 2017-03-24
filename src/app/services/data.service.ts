import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from "@angular/http";

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { NotificacaoService } from '../services/notificacao.service';
import { ApiHttpService } from './api-http.service';
import { Conta } from "../models/models.module";
import { Model } from "../models/generic-model.model";


@Injectable()
export class ContasService<T extends Model> {

	apiBaseUrl:string;
    dataObservable$: Observable<Model[]>;
    private _dataBehaviorSubject: BehaviorSubject<Model[]>;
    private dataStore: {
        dataList: Model[]
    };

    constructor(private apiHttp: ApiHttpService, private notificacaoService: NotificacaoService) {
        this.dataStore = { dataList: [] };
        this._dataBehaviorSubject = <BehaviorSubject<Model[]>>new BehaviorSubject([]);
        this.dataObservable$ = this._dataBehaviorSubject.asObservable();
    }

    getAllContas() {

        this.apiHttp.get(this.apiBaseUrl)
            .subscribe(
            data => {
                console.log("Data return on service:", data);

                if (data.status === "sucesso") {
                    this.dataStore.dataList = data.contas;
                    this._dataBehaviorSubject.next(Object.assign({}, this.dataStore).dataList);
                }
            },
            error => {
                console.log(error);
            });
    }

    create(nomeConta) {

        this.apiHttp
            .post(this.apiBaseUrl, { nomeConta: nomeConta })
            .subscribe(
            data => {
                if (data.status === "sucesso") {
                    this.dataStore.dataList.push(data.conta);
                    this._dataBehaviorSubject.next(Object.assign({}, this.dataStore).dataList);

                    this.notificacaoService.sendSucessMessage(`Model "${nomeConta}" salva com sucesso.`);
                } else if (data.status === "erro") {
                    console.log(data.message);
                    this.notificacaoService.sendErrorMessage(data.message);
                }
            },
            error => {
                console.log(error);
            });
    }

    remove(modelId) {

        this.apiHttp
            .delete(`${this.apiBaseUrl}/${modelId}`)
            .subscribe(
            data => {
                if (data.status === "sucesso") {
                    this.dataStore.dataList.forEach((dataItem, i) => {
                        if (dataItem._id === modelId) {
                            this.dataStore.dataList.splice(i, 1);
                        }
                    });
                    this._dataBehaviorSubject.next(Object.assign({}, this.dataStore).dataList);

                    this.notificacaoService.sendSucessMessage('Model removida com sucesso.');
                } else if (data.status === "erro") {
                    console.log(data.message);
                    this.notificacaoService.sendErrorMessage(data.message);
                }
            },
            error => {
                console.log(error);
            });
    }

    update(idConta, nomeConta) {

        this.apiHttp
            .put(`${this.apiBaseUrl}/${idConta}`, { nomeConta: nomeConta })
            .subscribe(
            data => {
                if (data.status === "sucesso") {
                    this.dataStore.dataList.forEach((c, i) => {
                        if (c._id === data.conta._id) {
                            this.dataStore.dataList[i] = data.conta;
                        }
                    });
                    this._dataBehaviorSubject.next(Object.assign({}, this.dataStore).dataList);

                    this.notificacaoService.sendSucessMessage(`Model "${nomeConta}" salva com sucesso.`);

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
