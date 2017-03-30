import { Log } from './../util/log';
import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from "@angular/http";

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { NotificationsService } from 'angular2-notifications';

import { ApiHttpService } from './api-http.service';
import { Conta } from "../models/models.module";
import { Model } from "../models/generic-model.model";

export class DataService<T extends Model> {

	protected successPostMessage: string = "Objeto criado com sucesso.";
	protected successPutMessage: string = "Objeto alterado com sucesso.";
	protected successDeleteMessage: string = "Objeto deletado com sucesso.";

	dataObservable$: Observable<Model[]>;
	private _dataBehaviorSubject: BehaviorSubject<Model[]>;
	private dataStore: {
		dataList: Model[]
	};

	constructor(private _apiHttp: ApiHttpService, private _notificationsService: NotificationsService, private apiBaseUrl) {
		this.dataStore = { dataList: [] };
		this._dataBehaviorSubject = <BehaviorSubject<Model[]>>new BehaviorSubject([]);
		this.dataObservable$ = this._dataBehaviorSubject.asObservable();
	}

	protected setApiBaseUrl(apiBaseUrl: string) {
		this.apiBaseUrl = apiBaseUrl;
	}

	retrieve() {

		this._apiHttp.get(this.apiBaseUrl)
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

		this._apiHttp
			.post(this.apiBaseUrl, payLoad)
			.subscribe(
			jsonData => {
				if (jsonData.status === "sucesso") {
					this.dataStore.dataList.push(jsonData.data);
					this._dataBehaviorSubject.next(Object.assign({}, this.dataStore).dataList);

					this._notificationsService.success('Sucesso', this.successPostMessage);
				} else if (jsonData.status === "erro") {
					this._notificationsService.error('Erro', jsonData.message);
				}
			},
			error => {
				Log.error(error);
			});
	}

	remove(modelId) {

		this._apiHttp
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

					this._notificationsService.success('Sucesso', this.successDeleteMessage);
				} else if (jsonData.status === "erro") {
					this._notificationsService.error('Erro', jsonData.message);
				}
			},
			error => {
				Log.error(error);
			});
	}

	update(modelId, payLoad) {

		this._apiHttp
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

					this._notificationsService.success('Sucesso', this.successPutMessage);

				} else if (jsonData.status === "erro") {
					this._notificationsService.error('Erro', jsonData.message);
				}
			},
			error => {
				Log.error(error);
			});
	}
}

