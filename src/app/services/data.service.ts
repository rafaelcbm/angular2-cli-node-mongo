import { Log } from './../util/log';
import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';

import { Observable ,  BehaviorSubject ,  Subject } from 'rxjs';

import { NotificationsService } from 'angular2-notifications';

import { ApiHttpService } from './api-http.service';
import { Conta } from '../models/models.module';
import { Model } from '../models/generic-model.model';

export class DataService<T extends Model> {

	protected successPostMessage = 'Objeto criado com sucesso.';
	protected successPutMessage = 'Objeto alterado com sucesso.';
	protected successDeleteMessage = 'Objeto deletado com sucesso.';

	dataObservable$: Observable<Model[]>;
	protected _dataBehaviorSubject: BehaviorSubject<Model[]>;
	protected _dataStore: {
		dataList: Model[]
	};

	constructor(protected _apiHttp: ApiHttpService, protected _notificationsService: NotificationsService, protected apiBaseUrl) {
		this._dataStore = { dataList: [] };
		this._dataBehaviorSubject = <BehaviorSubject<Model[]>>new BehaviorSubject([]);
		this.dataObservable$ = this._dataBehaviorSubject.asObservable();
	}

	protected setApiBaseUrl(apiBaseUrl: string) {
		this.apiBaseUrl = apiBaseUrl;
	}

	retrieve() {

		this._apiHttp.get(this.apiBaseUrl)
			.subscribe(
				(jsonData: any) => {
				if (jsonData.status === 'sucesso') {
					this._dataStore.dataList = jsonData.data;
					this._dataBehaviorSubject.next(Object.assign({}, this._dataStore).dataList);
				} else if (jsonData.status === 'erro') {
					this._notificationsService.error('Erro', jsonData.message);
				}
			},
			error => {
				console.error(error);
			});
	}

	create(payLoad) {

		this._apiHttp
			.post(this.apiBaseUrl, payLoad)
			.subscribe(
			(jsonData: any) => {
				if (jsonData.status === 'sucesso') {
					this._dataStore.dataList.push(jsonData.data);
					this._dataBehaviorSubject.next(Object.assign({}, this._dataStore).dataList);

					this._notificationsService.success('Sucesso', this.successPostMessage);
				} else if (jsonData.status === 'erro') {
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
			(jsonData: any) => {
				if (jsonData.status === 'sucesso') {
					this._dataStore.dataList.forEach((dataItem, i) => {
						if (dataItem._id === modelId) {
							this._dataStore.dataList.splice(i, 1);
						}
					});
					this._dataBehaviorSubject.next(Object.assign({}, this._dataStore).dataList);

					this._notificationsService.success('Sucesso', this.successDeleteMessage);
				} else if (jsonData.status === 'erro') {
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
			(jsonData: any) => {
				if (jsonData.status === 'sucesso') {
					this._dataStore.dataList.forEach((dataItem, i) => {
						if (dataItem._id === jsonData.data._id) {
							this._dataStore.dataList[i] = jsonData.data;
						}
					});
					this._dataBehaviorSubject.next(Object.assign({}, this._dataStore).dataList);

					this._notificationsService.success('Sucesso', this.successPutMessage);

				} else if (jsonData.status === 'erro') {
					this._notificationsService.error('Erro', jsonData.message);
				}
			},
			error => {
				Log.error(error);
			});
	}
}

