import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

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
	) { }

	ngOnInit() {
		this.route.params
			// (+) converts string 'id' to a number
			.switchMap((params: Params) => this.contasService.getContasById(params['id']))
			.subscribe((conta: any) => this.conta = conta);
	}

	gotoContas() {
		let contaId = this.conta ? this.conta.id : null;
		// Pass along the conta id if available
		// so that the contaList component can select that conta
		// Include a junk 'foo' property for fun.
		this.router.navigate(['/main/contas', { id: contaId, foo: 'foo' }]);
	}
}
