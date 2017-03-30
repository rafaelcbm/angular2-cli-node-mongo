import { Injectable } from '@angular/core';

import { NotificationsService } from 'angular2-notifications';

import { MessagesService } from './messages.service';
import { DataService } from './data.service';
import { ApiHttpService } from './api-http.service';
import { Lancamento } from "../models/models.module";


@Injectable()
export class LancamentosService extends DataService<Lancamento> {

    constructor(apiHttp: ApiHttpService,  _notificationsService: NotificationsService, private msgService: MessagesService ) {
		super(apiHttp, _notificationsService, '/api/lancamentos/');
	}

	create(payLoad) {
		this.successPostMessage = this.msgService.getMessage(this.msgService.SUCCESS_CREATE_LANCAMENTO);
		super.create(payLoad);
	}

	remove(modelId) {
		this.successDeleteMessage = this.msgService.getMessage(this.msgService.SUCCESS_DELETE_LANCAMENTO);
		super.remove(modelId);
	}

	update(modelId, payLoad) {
		this.successPutMessage = this.msgService.getMessage(this.msgService.SUCCESS_UPDATE_LANCAMENTO);
		super.update(modelId, payLoad);
	}
}
