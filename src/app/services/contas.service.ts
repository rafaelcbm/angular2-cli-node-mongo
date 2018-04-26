import { Injectable } from '@angular/core';

import { NotificationsService } from 'angular2-notifications';

import { ENV } from './env-config';
import { MessagesService } from './messages.service';
import { DataService } from './data.service';
import { ApiHttpService } from './api-http.service';
import { Conta } from "../models/models.module";


@Injectable()
export class ContasService extends DataService<Conta> {

	constructor(apiHttp: ApiHttpService, _notificationsService: NotificationsService, private msgService: MessagesService) {
		super(apiHttp, _notificationsService, `${ENV.BASE_API}contas/`);
		this.successDeleteMessage = this.msgService.getMessage(this.msgService.SUCCESS_DELETE_CONTA);
	}

	create(payLoad) {
		this.successPostMessage = this.msgService.getMessage(this.msgService.SUCCESS_CREATE_CONTA, payLoad.nomeConta);
		super.create(payLoad);
	}

	update(modelId, payLoad) {
		this.successPutMessage = this.msgService.getMessage(this.msgService.SUCCESS_UPDATE_CONTA, payLoad.nomeConta);
		super.update(modelId, payLoad);
	}
}
