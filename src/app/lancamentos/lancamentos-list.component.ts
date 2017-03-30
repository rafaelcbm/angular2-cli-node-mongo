import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Log } from './../util/log';
import { LancamentosService } from '../services/lancamentos.service';
import { Lancamento } from "../models/models.module";


@Component({
	selector: 'lancamentos-list',
	templateUrl: './lancamentos-list.component.html'
})
export class LancamentosListComponent implements OnInit {

	@Output() onSelectLancamento = new EventEmitter<Lancamento>();

	lancamentos$: Observable<Lancamento[]>;

	constructor(private lancamentosService: LancamentosService) { }

	ngOnInit() {

		this.lancamentos$ = this.lancamentosService.dataObservable$;

		this.lancamentosService.retrieve();
	}

	onSelect(lancamento: Lancamento) {
		this.onSelectLancamento.emit(lancamento);
	}
}
