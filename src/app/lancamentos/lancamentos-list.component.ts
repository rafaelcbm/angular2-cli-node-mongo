import { length } from './../../../server/config';
import { Categoria } from './../models/categoria.model';
import { Component, OnInit, EventEmitter, Output, ViewChild, ChangeDetectorRef } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

import { LancamentosService } from '../services/lancamentos.service';
import { FiltroLancamentoService } from './filtro-lancamento.service';
import { Lancamento } from "../models/models.module";
import { CategoriasService } from '../services/categorias.service';

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

	constructor(private lancamentosService: LancamentosService, private filtroLancamentoService: FiltroLancamentoService, private ref: ChangeDetectorRef, private categoriasService: CategoriasService) { }

	ngOnInit() {

		this.competenciaAtual = moment().format('YYYYMM');

		this.observarLancamentos();

		this.observarFiltroCompetencia();

		this.observarFiltroContas();

		this.observarFiltroCategorias();

		this.observarCategorias();

		this.lancamentosService.getByCompetencia(this.competenciaAtual);
	}

	observarLancamentos() {
		this.lancamentosService.dataObservable$.subscribe(lancamentos => {
			this.lancamentos = lancamentos;
			this.lancamentos = this.lancamentos.map(
				(lancamento: any) => {
					lancamento.showConta = true;
					lancamento.showLancamento = true;
					this.convertToString(lancamento);

					return lancamento;
				});
			this.atualizarSaldos();
			this.atualizarCategorias.call(this, this.filtroLancamentoService.obterCategoriasSeleciondas());
			this.atualizarContas.call(this, this.filtroLancamentoService.obterContasSeleciondas());
		});
	}

	convertToString(lancamento) {
		//Conversão somente devido a problema com a máscara.
		if (!lancamento.valor.toString().includes('.'))
			lancamento.valor = lancamento.valor.toString().concat('.00');
	}

	observarFiltroCompetencia() {
		this.filtroLancamentoService.competenciaLancamento$
			.debounceTime(500) // Caso o usuário altere rapidamente as competencia (nas setas), evita várias requisições.
			.distinctUntilChanged()
			.subscribe(novaCompetencia => {
				this.competenciaAtual = novaCompetencia;
				this.lancamentosService.getByCompetencia(novaCompetencia);
				this.atualizarSaldos();
			});
	}

	observarCategorias() {
		this.categoriasService.dataObservable$.subscribe(categorias => this.lancamentosService.getByCompetencia(this.competenciaAtual));
	}

	observarFiltroContas() {
		this.filtroLancamentoService.selectedContas$.subscribe(this.atualizarContas.bind(this));
	}

	atualizarContas(contasSelecionadas) {

		if (contasSelecionadas.length > 0) {
			this.lancamentos.forEach((lancamento: any) => {
				lancamento.showConta = false;

				if (contasSelecionadas.some(contasSelecionada => contasSelecionada == lancamento.conta.nome)) {
					lancamento.showConta = true;
				}
			});
		}
	}

	observarFiltroCategorias() {
		this.filtroLancamentoService.selectedCategorias$.subscribe(this.atualizarCategorias.bind(this));
	}

	atualizarCategorias(categoriasSelecionadas) {

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
	}

	onSelect(lancamento) {
		lancamento.showDetail = true;
	}

	consolidarLancamento(lancamento) {
		this.lancamentosService.consolidar(lancamento).subscribe(dadosLancamento => {
			let lancLista = this.lancamentos.find(l => l._id == dadosLancamento.id);
			if (lancLista) {
				lancLista.pago = dadosLancamento.pago;
			}
		});
	}

	atualizarSaldos() {
		this.inicializarSaldos();

		this.lancamentosService.obterSaldoUltimaCompetenciaAnterior(this.competenciaAtual).subscribe(competencia => {
			this.saldoAnterior = competencia.saldo;
			this.saldoAtual = this.saldoAnterior;
			if (this.lancamentos && this.lancamentos.length > 0) {
				this.atualizarSaldoAtual();
			}
		});
	}

	inicializarSaldos() {
		this.saldoAnterior = 0.0;
		this.saldoAtual = 0.0;
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

	//TODO: todos checks
	lancSelected = [];
	clickCheck($event) {
		let lancamentoSelected = $event.target.value;

		if ($event.target.checked) {
			this.lancSelected.push(lancamentoSelected);
		} else {
			this.lancSelected = this.lancSelected.filter(l => l !== lancamentoSelected);
		}
	}
}
