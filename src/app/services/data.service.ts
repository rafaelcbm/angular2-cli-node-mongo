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
export class DataService<T extends Model> {

    protected apiBaseUrl: string;
    protected successPostMessage: string = "Objeto criado com sucesso.";
    protected successPutMessage: string = "Objeto alterado com sucesso.";
    protected successDeleteMessage: string = "Objeto deletado com sucesso.";

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

    protected setApiBaseUrl(apiBaseUrl: string) {
        this.apiBaseUrl = apiBaseUrl;
    }

    retrieve() {

        this.apiHttp.get(this.apiBaseUrl)
            .subscribe(
            jsonData => {
                console.log("Data return on service:", jsonData);

                if (jsonData.status === "sucesso") {
                    this.dataStore.dataList = jsonData.data;                    
                    this._dataBehaviorSubject.next(Object.assign({}, this.dataStore).dataList);
                }
            },
            error => {
                console.log(error);
            });
    }

    create(payLoad) {

        this.apiHttp
            .post(this.apiBaseUrl, payLoad)
            .subscribe(
            jsonData => {
                if (jsonData.status === "sucesso") {
                    this.dataStore.dataList.push(jsonData.data);
                    this._dataBehaviorSubject.next(Object.assign({}, this.dataStore).dataList);

                    this.notificacaoService.sendSucessMessage(this.successPostMessage);
                } else if (jsonData.status === "erro") {
                    console.log(jsonData.message);
                    this.notificacaoService.sendErrorMessage(jsonData.message);
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
            jsonData => {
                if (jsonData.status === "sucesso") {
                    this.dataStore.dataList.forEach((dataItem, i) => {
                        if (dataItem._id === modelId) {
                            this.dataStore.dataList.splice(i, 1);
                        }
                    });
                    this._dataBehaviorSubject.next(Object.assign({}, this.dataStore).dataList);

                    this.notificacaoService.sendSucessMessage(this.successDeleteMessage);
                } else if (jsonData.status === "erro") {
                    console.log(jsonData.message);
                    this.notificacaoService.sendErrorMessage(jsonData.message);
                }
            },
            error => {
                console.log(error);
            });
    }

    update(modelId, payLoad) {

        this.apiHttp
            .put(`${this.apiBaseUrl}/${modelId}`, payLoad)
            .subscribe(
            jsonData => {
                if (jsonData.status === "sucesso") {
                    this.dataStore.dataList.forEach((dataItem, i) => {
                        if (dataItem._id === jsonData.data._id) {
                            this.dataStore.dataList[i] = jsonData.data;
                        }
                    });
                    this._dataBehaviorSubject.next(Object.assign({}, this.dataStore).dataList);

                    this.notificacaoService.sendSucessMessage(this.successPutMessage);

                } else if (jsonData.status === "erro") {
                    console.log(jsonData.message);
                    this.notificacaoService.sendErrorMessage(jsonData.message);
                }
            },
            error => {
                console.log(error);
            });
    }
}

