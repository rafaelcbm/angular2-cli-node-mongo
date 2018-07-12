import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { switchMap, map } from 'rxjs/operators';
//Possivel importar assim devido ao @types/jquery.
//import * as $ from 'jquery';
// Não é possivel importar essã lib dessa forma, pois não é um modulo js. Tem q ser através do "declare".
//import * as toastr from 'toastr';
//declare var toastr: any;

import { ContasService } from '../services/contas.service';


@Component({
	selector: 'contas-detail',
	templateUrl: './contas-detail.component.html'
})
export class ContasDetailComponent implements OnInit {

	novaConta = false;
	conta: any;

	constructor(private route: ActivatedRoute, private router: Router, private contasService: ContasService) { }

	ngOnInit() {

		this.route.params
			.pipe(switchMap((params: Params) => this.contasService.dataObservable$.pipe(map(contas => {
				if (contas) {
					return contas.find(c => c._id === params['id'])
				}
			}))))
			.subscribe((conta: any) => {
				this.conta = conta

				//Se nova conta
				if (!this.conta) {
					this.novaConta = true;
				}
			});

		// NOTA: Sem o operador switchMap, necessários 2 subscribes
		//
		// this.route.params
		// 	.map((params: Params) => {
		// 		console.log("ContasDetailComponent.ngOnInit params['id']", params['id']);
		// 		return this.contasService.contas.map(contas => contas.find(c => c._id === params['id']));
		// 	})
		// 	.subscribe((paramsObservableResult: any) => {
		// 		console.log("CHEGOU NO subscribe do Observable params = ", paramsObservableResult);
		// 		paramsObservableResult.subscribe(conta => {
		// 			console.log("Valor realmente desejado no inner Observable:", conta)
		// 			this.conta = conta;
		// 		});
		// 	});
	}


	salvarConta(formValue) {

		if (this.novaConta) {
			this.contasService.create({ nomeConta: formValue.nome });
		} else {
			this.contasService.update(this.conta._id, { nomeConta: formValue.nome });
		}

		this.redirectToList();

		//Exemplo de utilização de libs externas:
		//JQuery
		//$("#campoNome").addClass("text-danger");
		//Toastr
		//toastr.success("Orders downloaded.");
	}

	removerConta() {

		this.contasService.remove(this.conta._id);

		this.redirectToList();
	}

	redirectToList() {
		if (this.novaConta) {
			this.router.navigate(['/main/contas']);
		} else {
			let contaId = this.conta._id;
			// Pass along the conta id if available
			// so that the contaList component can select that conta
			// Include a junk 'foo' property for fun.
			this.router.navigate(['/main/contas', { id: contaId, foo: 'foo' }]);
		}
	}
}
