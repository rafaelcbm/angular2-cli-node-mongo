import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { ContasService } from '../services/contas-service';
import { Conta } from "../models/models.module";


@Component({
	selector: 'contas-list',
	templateUrl: './contas-list.component.html'
})
export class ContasListComponent implements OnInit {

	contas: any[] = [];
	public selectedId: string;

	constructor(private contasService: ContasService, private route: ActivatedRoute, private router: Router) {	}

	ngOnInit() {
		this.contasService.getContas()
			.then(contas => this.contas = contas);
	}

	onSelect(conta: Conta) {
		this.selectedId = conta.id;
		// Navigate with relative link
		this.router.navigate([conta.id], { relativeTo: this.route });
	}
}
