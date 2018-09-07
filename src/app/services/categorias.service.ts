import { Injectable } from '@angular/core';

import { NotificationsService } from 'angular2-notifications';
import { Observable ,  Subject } from 'rxjs';

import { ENV } from './env-config';
import { MessagesService } from './messages.service';
import { DataService } from './data.service';
import { ApiHttpService } from './api-http.service';
import { Categoria } from '../models/models.module';


@Injectable()
export class CategoriasService extends DataService<Categoria> {

	static baseUrl = `${ENV.BASE_API}categorias/`;

	private flatCategoriasSource = new Subject<any>();
	flatCategorias$: Observable<any> = this.flatCategoriasSource.asObservable();

	private competenciaLancamentoSource = new Subject<string>();
	competenciaLancamento$ = this.competenciaLancamentoSource.asObservable();

	constructor(apiHttp: ApiHttpService, _notificationsService: NotificationsService, private msgService: MessagesService) {
		super(apiHttp, _notificationsService, CategoriasService.baseUrl);
		this.successPostMessage = this.msgService.getMessage(this.msgService.SUCCESS_CREATE_CATEGORIA);
		this.successDeleteMessage = this.msgService.getMessage(this.msgService.SUCCESS_DELETE_CATEGORIA);
		this.successPutMessage = this.msgService.getMessage(this.msgService.SUCCESS_UPDATE_CATEGORIA);

		//this.flatCategorias$ = new Observable(observer => this.flatCategoriasObserver = observer).share();
	}

	create(payLoad) {

		this._apiHttp
			.post(this.apiBaseUrl, payLoad)
			.subscribe(
				(jsonData: any) => {
					if (jsonData.status === 'sucesso') {
						this._dataStore.dataList = jsonData.data;
						this._dataBehaviorSubject.next(Object.assign({}, this._dataStore).dataList);

						//Atualiza a fonte de dados do dropdown de categorias
						this.getAll();

						this._notificationsService.success('Sucesso', this.successPostMessage);
					} else if (jsonData.status === 'erro') {
						this._notificationsService.error('Erro', jsonData.message);
					}
				},
				error => { console.log(error) });
	}

	remove(modelId) {

		this._apiHttp
			.delete(`${this.apiBaseUrl}/${modelId}`)
			.subscribe(
				(jsonData: any) => {
					if (jsonData.status === 'sucesso') {
						this._dataStore.dataList = jsonData.data;
						this._dataBehaviorSubject.next(Object.assign({}, this._dataStore).dataList);

						//Atualiza a fonte de dados do dropdown de categorias
						this.getAll();

						this._notificationsService.success('Sucesso', this.successDeleteMessage);
					} else if (jsonData.status === 'erro') {
						this._notificationsService.error('Erro', jsonData.message);
					}
				},
				error => { console.log(error) });
	}

	update(modelId, payLoad) {

		this._apiHttp
			.put(`${this.apiBaseUrl}/${modelId}`, payLoad)
			.subscribe(
				(jsonData: any) => {
					if (jsonData.status === 'sucesso') {
						this._dataStore.dataList = jsonData.data;
						this._dataBehaviorSubject.next(Object.assign({}, this._dataStore).dataList);

						//Atualiza a fonte de dados do dropdown de categorias
						this.getAll();

						this._notificationsService.success('Sucesso', this.successPutMessage);

					} else if (jsonData.status === 'erro') {
						this._notificationsService.error('Erro', jsonData.message);
					}
				},
				error => { console.log(error) });
	}

	getAll(): any {

		this._apiHttp.get(`${this.apiBaseUrl}/flat`)
			.subscribe(
				(jsonData: any) => {
					if (jsonData.status === 'sucesso') {

						return this.flatCategoriasSource.next(jsonData.data);

					} else if (jsonData.status === 'erro') {
						this._notificationsService.error('Erro', jsonData.message);
					}
				},
				error => { console.log(error) });
	}
}
