import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { NotificationsService } from "angular2-notifications";
import { Observable } from 'rxjs/Observable';

import { Log } from './../util/log';
import { NotificacaoService } from '../services/notificacao.service';
import { LancamentosService } from '../services/lancamentos.service';
import { Lancamento } from "../models/models.module";


@Component({
	selector: 'lancamentos-list',
	templateUrl: './lancamentos-list.component.html'
})
export class LancamentosListComponent implements OnInit {

	@Output() onSelectLancamento = new EventEmitter<Lancamento>();

	lancamentos$: Observable<Lancamento[]>;

	constructor(private lancamentosService: LancamentosService,
		private notificacaoService: NotificacaoService,
		private _notificationsService: NotificationsService) { }

	ngOnInit() {

		this.lancamentos$ = this.lancamentosService.lancamentos;

		this.lancamentosService.getAllLancamentos();

		this.notificacaoService.errorMsg$.subscribe(
			errorMsg => this.showErrorMessage(errorMsg),
			error => Log.log(error)
		);

		this.notificacaoService.successMsg$.subscribe(
			successMsg => this.showSuccessMessage(successMsg),
			error => Log.log(error));
	}

	onSelect(lancamento: Lancamento) {
		this.onSelectLancamento.emit(lancamento);
	}

	adicionar() {
		this.onSelectLancamento.emit(new Lancamento());
	}

	showSuccessMessage(message: string) {
		this._notificationsService.success('Sucesso', message);
	}

	showErrorMessage(message: string) {
		this._notificationsService.error('Erro', message);
	}
}
