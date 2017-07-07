import { length } from './../../../server/config';
import { Categoria } from './../models/categoria.model';
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

	lancamentos: Lancamento[];

	constructor(private lancamentosService: LancamentosService, private filtroLancamentoService: FiltroLancamentoService) { }

	ngOnInit() {

		this.lancamentos$ = this.lancamentosService.dataObservable$;

		this.lancamentosService.dataObservable$.subscribe(lancamentos => {
			this.lancamentos = lancamentos;
			this.lancamentos = this.lancamentos.map(
				(lancamento: any) => {
					lancamento.show = true;
					return lancamento;
				});
			console.log('Lancamentos no subscribe = ', this.lancamentos)

		});

		this.filtroLancamentoService.competenciaLancamento$
			.debounceTime(500)
			.distinctUntilChanged()
			.subscribe(novaCompetencia => this.lancamentosService.getByCompetencia(novaCompetencia));

		this.filtroLancamentoService.selectedContas$
			.subscribe(contasSelecionadas => {
				if (contasSelecionadas.length > 0) {
					this.lancamentos.forEach((lancamento: any) => {
						console.log('Lancamento forEach = ', lancamento);
						lancamento.show = false;

						if (contasSelecionadas.some(contasSelecionada => contasSelecionada == lancamento.conta.nome)) {
							lancamento.show = true;
						}
					});
				}
			});

		this.filtroLancamentoService.selectedCategorias$
			.subscribe(categoriasSelecionadas => {
				if (categoriasSelecionadas.length > 0) {
					this.lancamentos.forEach((lancamento: any) => {
						console.log('Lancamento forEach = ', lancamento);
						lancamento.show = false;

						if (categoriasSelecionadas.some(categoriaSelecionada => categoriaSelecionada == lancamento.categoria.nome)) {
							lancamento.show = true;
						}
					});
				}
			}
			);

		let competenciaAtual = moment().format('YYYYMM');
		this.lancamentosService.getByCompetencia(competenciaAtual);
	}

	onSelect(lancamento: Lancamento) {
		this.filtroLancamentoService.selectLancamento(lancamento);
	}
}
