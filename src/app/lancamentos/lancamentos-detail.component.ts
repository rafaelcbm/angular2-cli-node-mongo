import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/map';
import * as moment from 'moment';
import * as _ from 'lodash';
import { NotificationsService } from "angular2-notifications";

import { Log } from './../util/log';
import { Util } from './../util/util';
import { Categoria } from './../models/categoria.model';
import { Lancamento, Conta } from "../models/models.module";
import { CategoriasService } from './../services/categorias.service';
import { LancamentosService } from '../services/lancamentos.service';
import { ContasService } from '../services/contas.service';
import { FiltroLancamentoService } from './filtro-lancamento.service';

@Component({
	selector: 'lancamentos-detail',
	templateUrl: './lancamentos-detail.component.html',
	styleUrls: ['./lancamentos-detail.component.scss']
})
export class LancamentosDetailComponent implements OnInit {

	@Input()
	lancamento: any;
	@Output()
	onVoltar: EventEmitter<any> = new EventEmitter<any>();

	showLancamento = false;
	showDatePicker = false;
	contas: Conta[];
	categorias: Categoria[];
	dataLancamento = new Date().toISOString();

	//Apenas para testar o drop de contas
	contaSelectionada = new Conta();

	@ViewChild('inputDebitoSwitch')
	inputDebitoSwitch: ElementRef;
	@ViewChild('debitoSwitch')
	debitoSwitch: ElementRef;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private lancamentosService: LancamentosService,
		private contasService: ContasService,
		private categoriasService: CategoriasService,
		private filtroLancamentoService: FiltroLancamentoService,
		private renderer: Renderer
	) { }

	ngOnInit() {
		this.carregarContas();
		this.carregarCategorias();
		this.carregarLancamento();
	}

	carregarLancamento() {
		this.onLancamentoChange();
	}

	carregarContas() {
		this.contasService.dataObservable$.subscribe(
			contas => {
				this.contas = contas;
				this.associaContaDoLancamento();
			});

		this.contasService.retrieve();
	}

	carregarCategorias() {
		this.categoriasService.flatCategorias$.subscribe(
			categorias => {
				this.categorias = categorias;
				this.associaCategoriaDoLancamento();
			});

		this.categoriasService.getAll();
	}

	onLancamentoChange() {
		// Se novo Lancamento
		if (!this.lancamento._id) {
			this.dataLancamento = moment().format('YYYY-MM-DD');
			this.lancamento.isDebito = false;
			//this.lancamento.periodicidade = {};
			// this.lancamento.periodicidade.tipo = 'mes';
			// this.lancamento.tipoPeriodo = 'mes';

		} else {
			//Para funcionar com o input [type=date] é necessário converter o obj Date para uma string no formato YYYY-MM-DD,
			// seja usando new Date().toISOString().substring(0, 10) ou moment().format('YYYY-MM-DD').
			// O pipe de date funciona somente se o input for [type=text], não date. :(
			//this.dataTeste = moment().toDate().toISOString().substring(0, 10);

			//this.dataLancamento = moment(this.lancamento.data, 'DD/MM/YYYY').format('YYYY-MM-DD');
			this.dataLancamento = moment(this.lancamento.data).format('YYYY-MM-DD');

			// NOTA: Essa funcao eh chamada antes do "this.contas" ser carregado no OnInit, por isso a checagem antes.
			if (this.contas) {
				this.associaContaDoLancamento();
			}
			if (this.categorias) {
				this.associaCategoriaDoLancamento();
			}
		}
	}

	associaContaDoLancamento() {
		if (this.lancamento && this.lancamento.conta) {
			let contaEncontrada = this.contas.find(conta => conta._id === this.lancamento.conta._id);

			if (contaEncontrada) {
				this.lancamento.conta = contaEncontrada;
			}
		}
	}

	associaCategoriaDoLancamento() {
		if (this.lancamento && this.lancamento.categoria) {
			let categoriaEncontrada = this.categorias.find(categoria => categoria._id === this.lancamento.categoria._id);

			if (categoriaEncontrada) {
				this.lancamento.categoria = categoriaEncontrada;
			}
		}
	}

	salvarLancamento(formValue) {

		console.debug('formValue = ', formValue);
		// Clona e atribui os dados do formulario no obj que sera enviado ao server
		let novoLancamento: Lancamento = new Lancamento();
		Object.assign(novoLancamento, formValue);

		// Parse form values
		novoLancamento.data = moment(formValue.data, 'DD/MM/YYYY').toDate();
		novoLancamento.valor = Util.parseCurrency(formValue.valor);

		console.debug('novoLancamento = ', novoLancamento);

		if (this.lancamento._id) {
			this.lancamentosService.update(this.lancamento._id, { lancamento: novoLancamento });
			this.voltar();
		} else {
			this.lancamentosService.create({ lancamento: novoLancamento });
		}

	}

	removerLancamento() {
		this.lancamentosService.remove(this.lancamento._id);
		this.voltar();
	}

	voltar() {
		this.lancamento.showDetail = false;
		this.onVoltar.emit(true);
	}

	isLancamentoValido(formValue) {
		if (!formValue.conta || !formValue.categoria) {
			return false;
		}
		return true;
	}

	focusSwitch($event) {
		//console.log('changeSwitch event = ',$event);
		this.renderer.setElementStyle(this.debitoSwitch.nativeElement, 'borderColor', "#8ad4ee");
	}

	blurSwitch($event) {
		this.renderer.setElementStyle(this.debitoSwitch.nativeElement, 'borderColor', "#d1d4d7");
	}

	obterValorTotalParcelas(formValue) {
		if (formValue.valor) {
			let valorLancamentoParsed = parseFloat(formValue.valor.replace(',', '.'));
			if (formValue.qtdParcelas && formValue.parcelaAtual) {
				return valorLancamentoParsed * (formValue.qtdParcelas - formValue.parcelaAtual + 1);
			}
			return valorLancamentoParsed;
		}
	}

	//Apenas teste de como obter o valor do select através ngModelChange
	contasChanged(contaChanged) {
		//Log.log("contaChanged = ", contaChanged);
		this.contaSelectionada = contaChanged;
	}

	public obterSwalOptions() {
		return {
			title: 'Remover?',
			text: 'Esse lançamento possui parcelas futuras. Deseja remover?',
			type: 'question',
			backdrop: true,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Confirmar',
			cancelButtonText: 'Cancelar',
			allowOutsideClick: false,
			input: 'radio',
			inputOptions: {
				'um': 'Somente este',
				'todos': 'Todos a partir deste'
			},
			showCloseButton: true
		};
	}

	public confirmarRemocao($event) {
		if ($event == 'um') {
			this.removerLancamento();
		} else if ($event == 'todos') {
			this.lancamentosService.removerLancamentoParcelado(this.lancamento);
		}
		this.voltar();
	}
}
