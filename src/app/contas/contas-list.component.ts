import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { Observable } from 'rxjs';

import { ContasService } from '../services/contas.service';
import { Conta } from '../models/models.module';

@Component({
	selector: 'contas-list',
	templateUrl: './contas-list.component.html'
})
export class ContasListComponent implements OnInit {

	contas$: Observable<Conta[]>;
	public selectedId: string;

	constructor(private contasService: ContasService, private route: ActivatedRoute, private router: Router) { }

	ngOnInit() {
		this.contas$ = this.contasService.dataObservable$;

		this.contasService.retrieve();
	}

	onSelect(conta: Conta) {
		this.selectedId = conta._id;

		// Navigate with relative link
		this.router.navigate([conta._id], { relativeTo: this.route });
	}

	novaConta() {
		this.router.navigate(['new'], { relativeTo: this.route });
	}
}
