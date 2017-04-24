import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

import { LancamentosService } from '../services/lancamentos.service';
import { FiltroLancamentoService } from './filtro-lancamento.service';
import { Lancamento } from "../models/models.module";

@Component({
	selector: 'lancamentos-list',
	templateUrl: './lancamentos-list.component.html'
})
export class LancamentosListComponent implements OnInit {

	@Output() onSelectLancamento = new EventEmitter<Lancamento>();

	lancamentos$: Observable<Lancamento[]>;

	constructor(private lancamentosService: LancamentosService, private filtroLancamentoService: FiltroLancamentoService) { }

	ngOnInit() {

		this.lancamentos$ = this.lancamentosService.dataObservable$;

		this.filtroLancamentoService.competenciaLancamento$
			.debounceTime(500)
			.distinctUntilChanged()
			.subscribe(novaCompetencia => this.lancamentosService.getByCompetencia(novaCompetencia));

		let competenciaAtual = moment().format('YYYYMM');
		this.lancamentosService.getByCompetencia(competenciaAtual);
	}

	onSelect(lancamento: Lancamento) {
		this.onSelectLancamento.emit(lancamento);
	}
}
