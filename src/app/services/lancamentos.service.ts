import { Injectable } from '@angular/core';

import { NotificationsService } from 'angular2-notifications';

import { MessagesService } from './messages.service';
import { DataService } from './data.service';
import { ApiHttpService } from './api-http.service';
import { Lancamento } from "../models/models.module";


@Injectable()
export class LancamentosService extends DataService<Lancamento> {

	static baseUrl = '/api/lancamentos';

	constructor(apiHttp: ApiHttpService, _notificationsService: NotificationsService, private msgService: MessagesService) {
		super(apiHttp, _notificationsService, LancamentosService.baseUrl);
		this.successPostMessage = this.msgService.getMessage(this.msgService.SUCCESS_CREATE_LANCAMENTO);
		this.successDeleteMessage = this.msgService.getMessage(this.msgService.SUCCESS_DELETE_LANCAMENTO);
		this.successPutMessage = this.msgService.getMessage(this.msgService.SUCCESS_UPDATE_LANCAMENTO);
	}

	getByCompetencia(competencia: string) {
		this._apiHttp.get(`${LancamentosService.baseUrl}/${competencia}`)
			.subscribe(
			jsonData => {
				console.log("Data return on service:", jsonData);

				if (jsonData.status === "sucesso") {
					this._dataStore.dataList = jsonData.data;
					this._dataBehaviorSubject.next(Object.assign({}, this._dataStore).dataList);
				}
			},
			error => {
				console.log(error);
			});
	}
}
