import { Injectable } from '@angular/core';

import { NotificationsService } from 'angular2-notifications';

import { MessagesService } from './messages.service';
import { DataService } from './data.service';
import { ApiHttpService } from './api-http.service';
import { Categoria } from "../models/models.module";


@Injectable()
export class CategoriasService extends DataService<Categoria> {

	static baseUrl = '/api/categorias';

	constructor(apiHttp: ApiHttpService, _notificationsService: NotificationsService, private msgService: MessagesService) {
		super(apiHttp, _notificationsService, CategoriasService.baseUrl);
		this.successPostMessage = this.msgService.getMessage(this.msgService.SUCCESS_CREATE_CATEGORIA);
		this.successDeleteMessage = this.msgService.getMessage(this.msgService.SUCCESS_DELETE_CATEGORIA);
		this.successPutMessage = this.msgService.getMessage(this.msgService.SUCCESS_UPDATE_CATEGORIA);
	}
}
