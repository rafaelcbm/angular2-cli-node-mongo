import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
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
	 @Input() lancamento: Lancamento;
	contaSelectionada = new Conta();

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

		// this.lancamento.descricao = "Compra do Pão";
		// this.lancamento.data = new Date();
		// this.lancamento.valor = 150;
		// this.lancamento.isDebito = true;
		// this.lancamento.notas = "Nota da compra do pão";

		this.carregarContas();
	}

	carregarContas() {

		this.contasService.contas.subscribe(
			contas => {
				this.contas = contas;				

				this.contas.forEach((conta, index)=>{
					if(conta.nome === this.lancamento.conta.nome){
						console.log("Econtrou conta.nome = ",conta.nome);
						console.log("Econtrou this.lancamento.conta.nome = ",this.lancamento.conta.nome);
						
						this.lancamento.conta=conta;
					}
				});
			});

		this.contasService.getAllContas();
	}

	// NOTA: Essa funcao eh chamada antes do "this.contas" ser carregado, por isso a checagem antes.
	ngOnChanges(changes: SimpleChanges) {
    	console.log("ngOnChanges: novo lancamento = ", changes['lancamento'].currentValue);
    	console.log("ngOnChanges: this.contas = ", this.contas);

    	if(this.contas){
    		
    		let contaEncontrada = this.contas.find(conta => conta.nome === this.lancamento.conta.nome);
    		
    		if(contaEncontrada) {
    			this.lancamento.conta = contaEncontrada;
    		}
    	}
	}

	salvarLancamento(formValue) {

		console.log("salvarLancamento called !!!");
	}

	contasChanged(contaChanged) {

		console.log("contaChanged = ", contaChanged);

		//this.contaSelectionada=contaChanged;
	}
}
