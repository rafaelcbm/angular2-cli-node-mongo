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

	lancamentos$: Observable<Lancamento[]>;

	constructor(private lancamentosService: LancamentosService, private filtroLancamentoService: FiltroLancamentoService) { }

	ngOnInit() {

		this.lancamentos$ = this.lancamentosService.dataObservable$;

		this.filtroLancamentoService.competenciaLancamento$
			.debounceTime(500)
			.distinctUntilChanged()
			.subscribe(novaCompetencia => this.lancamentosService.getByCompetencia(novaCompetencia));

		this.filtroLancamentoService.selectedContas$
			.debounceTime(300)
			.distinctUntilChanged()
			.subscribe(contasSelecionadas => console.log('Contas selecionadas recebidas:', contasSelecionadas));

		this.filtroLancamentoService.selectedCategorias$
			.debounceTime(300)
			.distinctUntilChanged()
			.subscribe(categoriasSelecionadas => console.log('Categorias selecionadas recebidas:', categoriasSelecionadas));

		let competenciaAtual = moment().format('YYYYMM');
		this.lancamentosService.getByCompetencia(competenciaAtual);
	}

	onSelect(lancamento: Lancamento) {
		this.filtroLancamentoService.selectLancamento(lancamento);
	}
}
