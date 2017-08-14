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
	templateUrl: './lancamentos-list.component.html',
	styleUrls: ['./lancamentos-list.component.scss']
})
export class LancamentosListComponent implements OnInit {

	lancamentos: Lancamento[];

	constructor(private lancamentosService: LancamentosService, private filtroLancamentoService: FiltroLancamentoService) { }

	ngOnInit() {

		this.inicializarLancamentos();

		this.inicializarFiltroCompetencia();

		this.inicializarFiltroContas();

		this.inicializarFiltroCategorias();

		let competenciaAtual = moment().format('YYYYMM');
		this.lancamentosService.getByCompetencia(competenciaAtual);
	}

	inicializarLancamentos(){
		this.lancamentosService.dataObservable$.subscribe(lancamentos => {
			this.lancamentos = lancamentos;
			this.lancamentos = this.lancamentos.map(
				(lancamento: any) => {
					lancamento.showConta = true;
					lancamento.showLancamento = true;
					return lancamento;
				});
		});
	}


	inicializarFiltroCompetencia(){
		this.filtroLancamentoService.competenciaLancamento$
			.debounceTime(500)
			.distinctUntilChanged()
			.subscribe(novaCompetencia => this.lancamentosService.getByCompetencia(novaCompetencia));
	}

	inicializarFiltroContas(){
		this.filtroLancamentoService.selectedContas$
			.subscribe(contasSelecionadas => {
				if (contasSelecionadas.length > 0) {
					this.lancamentos.forEach((lancamento: any) => {
						lancamento.showConta = false;

						if (contasSelecionadas.some(contasSelecionada => contasSelecionada == lancamento.conta.nome)) {
							lancamento.showConta = true;
						}
					});
				}
			});
	}

	inicializarFiltroCategorias(){
		this.filtroLancamentoService.selectedCategorias$
			.subscribe(categoriasSelecionadas => {

				if (categoriasSelecionadas.length == 0) {
					this.lancamentos.forEach((lancamento:any) => lancamento.showLancamento = true);
				}

				if (categoriasSelecionadas.length > 0) {
					this.lancamentos.forEach((lancamento: any) => {
						lancamento.showLancamento = false;

						if (categoriasSelecionadas.some(categoriaSelecionada => categoriaSelecionada == lancamento.categoria.nome)) {
							lancamento.showLancamento = true;
						}
					});
				}
			});
	}

	onSelect(lancamento: Lancamento) {
		this.filtroLancamentoService.selectLancamento(lancamento);
	}

	showLancamento(lancamento: any) {
		return lancamento.showConta && lancamento.showLancamento;
	}
}
