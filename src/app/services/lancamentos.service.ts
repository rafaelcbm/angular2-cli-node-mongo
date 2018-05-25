import { NextFunction } from 'express';
import { Injectable } from '@angular/core';

import { NotificationsService } from 'angular2-notifications';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
//import 'rxjs/add/operator/of';

import { Log } from './../util/log';
import { MessagesService } from './messages.service';
import { DataService } from './data.service';
import { ApiHttpService } from './api-http.service';
import { Lancamento } from "../models/models.module";
import { FiltroLancamentoService } from '../lancamentos/filtro-lancamento.service';
import { ENV } from './env-config';

@Injectable()
export class LancamentosService extends DataService<Lancamento> {

	static baseUrl = `${ENV.BASE_API}lancamentos/`;

	constructor(apiHttp: ApiHttpService, _notificationsService: NotificationsService, private msgService: MessagesService, private filtroLancamentoService: FiltroLancamentoService) {
		super(apiHttp, _notificationsService, LancamentosService.baseUrl);
		this.successPostMessage = this.msgService.getMessage(this.msgService.SUCCESS_CREATE_LANCAMENTO);
		this.successDeleteMessage = this.msgService.getMessage(this.msgService.SUCCESS_DELETE_LANCAMENTO);
		this.successPutMessage = this.msgService.getMessage(this.msgService.SUCCESS_UPDATE_LANCAMENTO);
	}

	getByCompetencia(competencia: string) {
		this._apiHttp.get(`${LancamentosService.baseUrl}/${competencia}`)
			.subscribe(
				jsonData => {
					if (jsonData.status === "sucesso") {
						this._dataStore.dataList = jsonData.data;
						this._dataBehaviorSubject.next(Object.assign({}, this._dataStore).dataList);
					}
				},
				error => {
					Log.error(error);
				});
	}

	create(payLoad) {

		this._apiHttp
			.post(this.apiBaseUrl, payLoad)
			.subscribe(
				jsonData => {
					if (jsonData.status === "sucesso") {
						this._dataStore.dataList.push(jsonData.data);
						this._dataBehaviorSubject.next(Object.assign({}, this._dataStore).dataList);

						this.filtroLancamentoService.novaCompetencia(moment(payLoad.lancamento.data, 'YYYY-MM-DD').format('YYYYMM'));

						this._notificationsService.success('Sucesso', this.successPostMessage);

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
						this._dataStore.dataList.forEach((dataItem, i) => {
							if (dataItem._id === jsonData.data._id) {
								this._dataStore.dataList[i] = jsonData.data;
							}
						});
						this._dataBehaviorSubject.next(Object.assign({}, this._dataStore).dataList);

						// Atualiza também para a nova competência, de acordo com a data alterada do lançamento.
						this.filtroLancamentoService.novaCompetencia(moment(payLoad.lancamento.data, 'YYYY-MM-DD').format('YYYYMM'));

						this._notificationsService.success('Sucesso', this.successPutMessage);

					} else if (jsonData.status === "erro") {
						this._notificationsService.error('Erro', jsonData.message);
					}
				},
				error => {
					Log.error(error);
				});
	}

	consolidar(lancamento): any {

		return Observable.create((observer: Observer<any>) => {
			this._apiHttp
				.put(`${this.apiBaseUrl}consolidar/${lancamento._id}/${!lancamento.pago}`, {})
				.subscribe(
					jsonData => {
						if (jsonData.status === "sucesso") {
							let lancamentoPago = jsonData.data.pago;
							this._notificationsService.success('Sucesso', `Lançamento '${lancamento.descricao}' ${lancamentoPago ? 'pago' : 'não pago'} !`);
							observer.next({ id: lancamento._id, pago: lancamentoPago });
						}
					},
					error => {
						Log.error(error);
					});
		});
	}

	obterSaldoCompetencia(competencia) {

		return Observable.create((observer: Observer<any>) => {
			this._apiHttp.get(`${LancamentosService.baseUrl}competencia/${competencia}`)
				.subscribe(
					jsonData => {
						if (jsonData.status === "sucesso") {
							let competencia = {
								competencia: jsonData.data.competencia,
								saldo: jsonData.data.saldo
							}
							observer.next(competencia);
						}
					},
					error => {
						Log.error(error);
					});
		});
	}

	obterSaldoUltimaCompetenciaAnterior(competencia) {

		return Observable.create((observer: Observer<any>) => {
			this._apiHttp.get(`${LancamentosService.baseUrl}competencia/anterior/${competencia}`)
				.subscribe(
					jsonData => {
						if (jsonData.status === "sucesso") {
							let competencia = {
								competencia: jsonData.data.competencia,
								saldo: jsonData.data.saldo
							}
							observer.next(competencia);
						}
					},
					error => {
						Log.error(error);
					});
		});
	}

	removeLancamentoPeriodico(modelId) {

		this._apiHttp
			.delete(`${this.apiBaseUrl}/${modelId}`)
			.subscribe(
			jsonData => {
				if (jsonData.status === "sucesso") {
					this._dataStore.dataList.forEach((dataItem, i) => {
						if (dataItem._id === modelId) {
							this._dataStore.dataList.splice(i, 1);
						}
					});
					this._dataBehaviorSubject.next(Object.assign({}, this._dataStore).dataList);

					this._notificationsService.success('Sucesso', this.successDeleteMessage);
				} else if (jsonData.status === "erro") {
					this._notificationsService.error('Erro', jsonData.message);
				}
			},
			error => {
				Log.error(error);
			});
	}

}
