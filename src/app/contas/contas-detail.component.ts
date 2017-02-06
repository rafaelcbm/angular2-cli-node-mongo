import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/map';
//Possivel importar assim devido ao @types/jquery.
import * as $ from 'jquery';
// Não é possivel importar essã lib dessa forma, pois não é um modulo js. Tem q ser através do "declare".
//import * as toastr from 'toastr';

import { Conta } from "../models/models.module";
import { ContasService } from '../services/contas-service';

declare var toastr: any;

@Component({
    selector: 'contas-detail',
    templateUrl: './contas-detail.component.html'
})
export class ContasDetailComponent implements OnInit {


    novaConta = false;
    conta: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private contasService: ContasService
    ) {
        console.log("ContasDetailComponent.constructor");
        toastr.options = { positionClass: 'toast-bottom-right', };
    }

    ngOnInit() {
        console.log("ContasDetailComponent.ngOnInit");

        this.route.params
            .switchMap((params: Params) => this.contasService.contas.map(contas => contas.find(c => c._id === params['id'])))
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

    salvarConta(formValue) {

        console.log("salvarConta Conta ", this.conta);
        console.log("salvarConta Conta Nome:", formValue.nome);

        if (this.novaConta) {
            this.contasService.create(formValue.nome);
        } else {
            this.contasService.update(this.conta._id, formValue.nome);
        }

        this.redirectToList();

        //Exemplo de utilização de libs externas:
        $("#campoNome").addClass("text-danger");
        toastr.success("Orders downloaded.");
    }

    removerConta(conta) {
        console.log("Remover Conta chamado", conta);

        this.contasService.remove(this.conta._id);

        this.redirectToList();
    }
}
