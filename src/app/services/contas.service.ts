import { Injectable } from '@angular/core';

import { NotificationsService } from 'angular2-notifications';

import { MessagesService } from './messages.service';
import { DataService } from './data.service';
import { ApiHttpService } from './api-http.service';
import { Conta } from "../models/models.module";

@Injectable()
export class ContasService extends DataService<Conta> {

	constructor(apiHttp: ApiHttpService, _notificationsService: NotificationsService, private msgService: MessagesService) {
		super(apiHttp, _notificationsService, '/api/contas/');
		this.successDeleteMessage = this.msgService.getMessage(this.msgService.SUCCESS_DELETE_CONTA);
	}

	create(payLoad) {
		this.successPostMessage = this.msgService.getMessage(this.msgService.SUCCESS_CREATE_CONTA, payLoad.nomeConta);
		super.create(payLoad);
	}

	remove(modelId) {
		super.remove(modelId);
	}

	update(modelId, payLoad) {
		this.successPutMessage = this.msgService.getMessage(this.msgService.SUCCESS_UPDATE_CONTA, payLoad.nomeConta);
		super.update(modelId, payLoad);
	}
}
