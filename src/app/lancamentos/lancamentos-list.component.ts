import { length } from './../../../server/config';
import { Categoria } from './../models/categoria.model';
import { Component, OnInit, EventEmitter, Output, ViewChild, ChangeDetectorRef } from '@angular/core';

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

	saldoAnterior;
	saldoAtual;
	competenciaAtual;

	lancamentos: any[];

	constructor(private lancamentosService: LancamentosService, private filtroLancamentoService: FiltroLancamentoService, private ref: ChangeDetectorRef) { }

	ngOnInit() {

		this.competenciaAtual = moment().format('YYYYMM');

		this.observarSaldoCompetencia();

		this.inicializarLancamentos();

		this.inicializarFiltroCompetencia();

		this.inicializarFiltroContas();

		this.inicializarFiltroCategorias();

		this.observarLancamentoConsolidado();

		this.lancamentosService.getByCompetencia(this.competenciaAtual);

		//this.lancamentosService.obterSaldoCompetencia(+competenciaAtual, true);
	}

	inicializarLancamentos() {
		this.lancamentosService.dataObservable$.subscribe(lancamentos => {
			this.lancamentos = lancamentos;
			this.lancamentos = this.lancamentos.map(
				(lancamento: any) => {
					lancamento.showConta = true;
					lancamento.showLancamento = true;
					this.convertToString(lancamento);

					return lancamento;
				});
			this.lancamentosService.obterSaldoCompetencia(this.competenciaAtual - 1, false);
		});
	}

	convertToString(lancamento) {
		//Conversão somente devido a problema com a máscara.
		if (!lancamento.valor.toString().includes('.'))
			lancamento.valor = lancamento.valor.toString().concat('.00');
	}

	inicializarFiltroCompetencia() {
		this.filtroLancamentoService.competenciaLancamento$
			.debounceTime(500)
			.distinctUntilChanged()
			.subscribe(novaCompetencia => this.lancamentosService.getByCompetencia(novaCompetencia));
	}

	inicializarFiltroContas() {
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

	inicializarFiltroCategorias() {
		this.filtroLancamentoService.selectedCategorias$
			.subscribe(categoriasSelecionadas => {

				if (categoriasSelecionadas.length == 0) {
					this.lancamentos.forEach((lancamento: any) => lancamento.showLancamento = true);
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

	onSelect(lancamento) {
		lancamento.showDetail = true;
	}

	showLancamento(lancamento: any) {
		return lancamento.showConta && lancamento.showLancamento;
	}

	consolidarLancamento(lancamento) {
		this.lancamentosService.consolidar(lancamento);
	}

	observarLancamentoConsolidado() {
		this.lancamentosService.lancamentoConsolidado$.subscribe(dadosLancamento => {
			let lancLista = this.lancamentos.find(l => l._id == dadosLancamento.id);
			if (lancLista) {
				lancLista.pago = dadosLancamento.pago;
			}
		});
	}

	observarSaldoCompetencia(): any {
		this.observarSaldoCompetenciaAnterior();
		// Sem necessidade atualmente
		// this.observarSaldoCompetenciaAtual();
	}

	observarSaldoCompetenciaAnterior(): any {
		this.lancamentosService.saldoAnterior$.subscribe(competencia => {
			this.saldoAnterior = competencia.saldo ? competencia.saldo : 0.0;
			if (this.lancamentos && this.lancamentos.length > 0) {
				this.atualizarSaldoAtual();
			}
		});
	}

	atualizarSaldoAtual() {
		let saldoAtualizado = this.lancamentos.reduce((acum, lancAtual) => {
			if (lancAtual.isDebito) {
				acum -= parseFloat(lancAtual.valor);
			} else {
				acum += parseFloat(lancAtual.valor);
			}
			return acum;
		}, this.saldoAnterior);

		this.saldoAtual = saldoAtualizado;
	}

	observarSaldoCompetenciaAtual(): any {
		this.lancamentosService.saldoAtual$.subscribe(competencia => {
			this.saldoAtual = competencia.saldo ? competencia.saldo : 0.0;
		});
	}

	//TODO: todos checks
	lancSelected = [];
	clickCheck($event) {
		let lancamentoSelected = $event.target.value;

		if ($event.target.checked) {
			this.lancSelected.push(lancamentoSelected);
		} else {
			this.lancSelected = this.lancSelected.filter(l => l !== lancamentoSelected);
		}

		console.log(`Lancs = ${this.lancSelected}`);
	}
}
