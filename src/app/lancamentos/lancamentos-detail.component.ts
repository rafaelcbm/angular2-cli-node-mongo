import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/map';
import * as moment from 'moment';
import 'moment/locale/pt-br';


import { NotificationsService } from "angular2-notifications";

import { Lancamento, Conta } from "../models/models.module";

import { LancamentosService } from '../services/lancamentos-service';
import { ContasService } from '../services/contas-service';


@Component({
	selector: 'lancamentos-detail',
	templateUrl: './lancamentos-detail.component.html'
})
export class LancamentosDetailComponent implements OnInit {

	contas: Conta[];
	@Input() lancamento: Lancamento;

	contaSelectionada = new Conta();

	dataTeste: any;


	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private lancamentosService: LancamentosService,
		private contasService: ContasService,
		private _notificationsService: NotificationsService
	) {
		console.log("Chamou constructor ");
	}

	ngOnInit() {
		console.log("Chamou ngOnInit ");

		moment.locale('pt-BR');
		console.log(moment.locale());

		this.carregarContas();

		//Para funcionar com o input [type=date] é necessário converter o obj Date para uma string no formato YYYY-MM-DD,
		// seja usando new Date().toISOString().substring(0, 10) ou moment().format('YYYY-MM-DD').
		// O pipe de date funciona somente se o input for [type=text], não date. :(
		//this.dataTeste = moment().toDate().toISOString().substring(0, 10);		
		this.dataTeste = moment().format('YYYY-MM-DD');
	}

	carregarContas() {

		this.contasService.contas.subscribe(
			contas => {
				this.contas = contas;

				this.associaContaDoLancamento();
			});

		this.contasService.getAllContas();
	}

	// NOTA: Essa funcao eh chamada antes do "this.contas" ser carregado, por isso a checagem antes.
	ngOnChanges(changes: SimpleChanges) {
		console.log("ngOnChanges: novo lancamento = ", changes['lancamento'].currentValue);

		if (this.contas) {
			this.associaContaDoLancamento();
		}
	}

	associaContaDoLancamento() {
		let contaEncontrada = this.contas.find(conta => conta.nome === this.lancamento.conta.nome);

		if (contaEncontrada) {
			this.lancamento.conta = contaEncontrada;
		}
	}

	salvarLancamento(formValue) {
		console.log("salvarLancamento called !!!");

		let date = moment(formValue.data, 'YYYY-MM-DD', 'pt-BR', true);
		console.log("date parsed on moment =", date);
		console.log("date parsed date.format('DD/MM/YYYY') =", date.format('DD/MM/YYYY'));

		// Clona e atribui os dados do formulario no obj que sera enviado ao server
		let novoLancamento = {};
		Object.assign(novoLancamento, formValue);
		console.log("novoLancamento =", novoLancamento);

		
		this.lancamentosService.create(novoLancamento);
		
		// if (!this.lancamento) {
		// 	this.lancamentosService.create(novoLancamento);
		// } else {
		// 	this.lancamentosService.update(this.lancamento._id, novoLancamento);
		// }
	}

	contasChanged(contaChanged) {

		console.log("contaChanged = ", contaChanged);

		this.contaSelectionada = contaChanged;
	}
}
