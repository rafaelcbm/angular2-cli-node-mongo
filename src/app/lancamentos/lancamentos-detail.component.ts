import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/map';

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
	lancamento: Lancamento = new Lancamento();
	contaSelectionada = new Conta();

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private lancamentosService: LancamentosService,
		private contasService: ContasService,
		private _notificationsService: NotificationsService
	) { }

	ngOnInit() {
		this.lancamento.descricao = "Compra do Pão";
		this.lancamento.data = new Date();
		this.lancamento.valor = 150;
		this.lancamento.isDebito = true;

		this.carregarContas();
	}

	carregarContas() {

		this.contasService.contas.subscribe(
			contas => {
				this.contas = contas;
				this.lancamento.conta = this.contas[0];
			});

		this.contasService.getAllContas();
	}

	salvarLancamento(formValue) {

		console.log("salvarLancamento called !!!");
	}

	contasChanged(contaChanged) {
		
		console.log("contaChanged = ", contaChanged);

	}
}
