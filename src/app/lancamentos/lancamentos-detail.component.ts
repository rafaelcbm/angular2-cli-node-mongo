import { Messages } from './../util/messages';
import { Util } from './../util/util';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/map';
import * as moment from 'moment';

import { NotificationsService } from "angular2-notifications";

import { Log } from './../util/log';
import { Lancamento, Conta } from "../models/models.module";
import { LancamentosService } from '../services/lancamentos.service';
import { ContasService } from '../services/contas.service';


@Component({
	selector: 'lancamentos-detail',
	templateUrl: './lancamentos-detail.component.html'
})
export class LancamentosDetailComponent implements OnInit {

	showDatePicker = false;

	contas: Conta[];
	@Input() lancamento: Lancamento;

	//Apenas para testar o drop de contas
	contaSelectionada = new Conta();
	dataLancamento = new Date().toISOString();


	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private lancamentosService: LancamentosService,
		private contasService: ContasService,
		private _notificationsService: NotificationsService,
		private messages: Messages
	) { }

	ngOnInit() {
		this.carregarContas();
	}

	carregarContas() {

		this.contasService.contas.subscribe(
			contas => {
				this.contas = contas;

				this.associaContaDoLancamento();
			});

		this.contasService.getAllContas();
	}

	ngOnChanges(changes: SimpleChanges) {
		Log.debug("ngOnChanges: novo lancamento = ", changes['lancamento'].currentValue);
		this.lancamento = changes['lancamento'].currentValue;

		// Se novo Lancamento
		if (!this.lancamento._id) {
			this.dataLancamento = moment().format('YYYY-MM-DD');
			this.lancamento.isDebito = false;

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
		}
	}

	associaContaDoLancamento() {
		if (this.lancamento.conta) {
			let contaEncontrada = this.contas.find(conta => conta.nome === this.lancamento.conta.nome);

			if (contaEncontrada) {
				this.lancamento.conta = contaEncontrada;
			}
		}
	}

	salvarLancamento(formValue) {



		// Clona e atribui os dados do formulario no obj que sera enviado ao server
		let novoLancamento: Lancamento = new Lancamento();
		Object.assign(novoLancamento, formValue);

		// Parse form values
		novoLancamento.data = moment(formValue.data, 'YYYY-MM-DD').toDate();
		novoLancamento.valor = Util.parseCurrency(formValue.valor);

		Log.log('novoLancamento = ', novoLancamento);

		if (this.lancamento._id) {
			this.lancamentosService.update(this.lancamento._id, novoLancamento);
		} else {
			this.lancamentosService.create(novoLancamento);
		}
	}

	removerLancamento() {
		this.lancamentosService.remove(this.lancamento._id);
		this.voltar();
	}

	voltar() {
		this.lancamento = null;
	}

	//Apenas teste
	contasChanged(contaChanged) {
		Log.log("contaChanged = ", contaChanged);
		this.contaSelectionada = contaChanged;
	}
}
