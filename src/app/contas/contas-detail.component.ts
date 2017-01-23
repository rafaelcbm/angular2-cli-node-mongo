import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/map';

import { Conta } from "../models/models.module";
import { ContasService } from '../services/contas-service';


@Component({
	selector: 'contas-detail',
	templateUrl: './contas-detail.component.html'
})
export class ContasDetailComponent implements OnInit {

	conta: any;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private contasService: ContasService
	) {
		console.log("ContasDetailComponent.constructor");
	}

	ngOnInit() {
		console.log("ContasDetailComponent.ngOnInit");
		this.route.params
			// (+) converts string 'id' to a number
			.switchMap((params: Params) => {
				console.log("ContasDetailComponent.ngOnInit params['id']", params['id']);
				return this.contasService.contas.map(contas => {
					console.log("ContasDetailComponent.ngOnInit contas",contas);
					contas.find(conta => conta._id == params['id'])
				})
			})
			.subscribe((conta: any) => this.conta = conta);
		//this.contasService.getContasById(params['id'])
	}

	gotoContas() {
		let contaId = this.conta ? this.conta.id : null;
		// Pass along the conta id if available
		// so that the contaList component can select that conta
		// Include a junk 'foo' property for fun.
		this.router.navigate(['/main/contas', { id: contaId, foo: 'foo' }]);
	}
}
