import { Injectable } from '@angular/core';

import { NotificationsService } from 'angular2-notifications';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { MessagesService } from './messages.service';
import { DataService } from './data.service';
import { ApiHttpService } from './api-http.service';
import { Categoria } from "../models/models.module";


@Injectable()
export class CategoriasService extends DataService<Categoria> {

	static baseUrl = '/api/categorias';

	flatCategorias$: Observable<any>;
	private flatCategoriasObserver: Observer<any>;

	constructor(apiHttp: ApiHttpService, _notificationsService: NotificationsService, private msgService: MessagesService) {
		super(apiHttp, _notificationsService, CategoriasService.baseUrl);
		this.successPostMessage = this.msgService.getMessage(this.msgService.SUCCESS_CREATE_CATEGORIA);
		this.successDeleteMessage = this.msgService.getMessage(this.msgService.SUCCESS_DELETE_CATEGORIA);
		this.successPutMessage = this.msgService.getMessage(this.msgService.SUCCESS_UPDATE_CATEGORIA);

		this.flatCategorias$ = new Observable(observer => this.flatCategoriasObserver = observer).share();
	}

	create(payLoad) {

		this._apiHttp
			.post(this.apiBaseUrl, payLoad)
			.subscribe(
			jsonData => {
				if (jsonData.status === "sucesso") {
					this._dataStore.dataList = jsonData.data;
					this._dataBehaviorSubject.next(Object.assign({}, this._dataStore).dataList);

					this._notificationsService.success('Sucesso', this.successPostMessage);
				} else if (jsonData.status === "erro") {
					this._notificationsService.error('Erro', jsonData.message);
				}
			});
	}

	remove(modelId) {

		this._apiHttp
			.delete(`${this.apiBaseUrl}/${modelId}`)
			.subscribe(
			jsonData => {
				if (jsonData.status === "sucesso") {
					this._dataStore.dataList = jsonData.data;
					this._dataBehaviorSubject.next(Object.assign({}, this._dataStore).dataList);

					this._notificationsService.success('Sucesso', this.successDeleteMessage);
				} else if (jsonData.status === "erro") {
					this._notificationsService.error('Erro', jsonData.message);
				}
			});
	}

	update(modelId, payLoad) {

		this._apiHttp
			.put(`${this.apiBaseUrl}/${modelId}`, payLoad)
			.subscribe(
			jsonData => {
				if (jsonData.status === "sucesso") {
					this._dataStore.dataList = jsonData.data;
					this._dataBehaviorSubject.next(Object.assign({}, this._dataStore).dataList);

					this._notificationsService.success('Sucesso', this.successPutMessage);

				} else if (jsonData.status === "erro") {
					this._notificationsService.error('Erro', jsonData.message);
				}
			});
	}

	getAll(): any {

		this._apiHttp.get(`${this.apiBaseUrl}/flat`)
			.subscribe(
			jsonData => {
				console.log("Data return on service:", jsonData);

				if (jsonData.status === "sucesso") {
					
					return this.flatCategoriasObserver.next(jsonData.data);

				} else if (jsonData.status === "erro") {
					this._notificationsService.error('Erro', jsonData.message);
				}
			},
			error => {
				console.log(error);
			});
	}
}
