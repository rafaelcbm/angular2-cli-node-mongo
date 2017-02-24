import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { NotificationsService } from "angular2-notifications";
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import 'moment/locale/pt-br';

import { NotificacaoService } from '../services/notificacao-service';
import { LancamentosService } from '../services/lancamentos-service';
import { Lancamento } from "../models/models.module";


@Component({
	selector: 'lancamentos-list',
	templateUrl: './lancamentos-list.component.html'
})
export class LancamentosListComponent implements OnInit {

	public options = {
		position: ["bottom", "right"],
		timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: true,
		lastOnBottom: true
	};

	@Output() onSelectLancamento = new EventEmitter<Lancamento>();

	lancamentos$: Observable<Lancamento[]>;	

	constructor(private lancamentosService: LancamentosService,
		private notificacaoService: NotificacaoService,
		private _notificationsService: NotificationsService) { }

	ngOnInit() {

		this.lancamentos$ = this.lancamentosService.lancamentos; // subscribe to entire collection

		this.lancamentosService.getAllLancamentos();    // load all lancamentos


		this.notificacaoService.errorMsg$.subscribe(
			errorMsg => this.showErrorMessage(errorMsg),
			error => console.log(error)
		);

		this.notificacaoService.successMsg$.subscribe(
			successMsg => this.showSuccessMessage(successMsg),
			error => console.log(error));
	}

	onSelect(lancamento: Lancamento) {

		this.onSelectLancamento.emit(lancamento);
	}

	adicionar() {

		this.onSelectLancamento.emit(new Lancamento());
	}

	showSuccessMessage(message: string) {
		//Sobrescreve as opções padrão, definidas no compoenente pai.
		this._notificationsService.success(
			'Sucesso',
			message
		)
	}

	showErrorMessage(message: string) {
		//Sobrescreve as opções padrão, definidas no compoenente pai.
		this._notificationsService.error(
			'Erro',
			message
		)
	}
}
