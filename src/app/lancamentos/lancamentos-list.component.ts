import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { LancamentosService } from '../services/lancamentos-service';
import { Lancamento, Conta } from "../models/models.module";


@Component({
	selector: 'lancamentos-list',
	templateUrl: './lancamentos-list.component.html'
})
export class LancamentosListComponent implements OnInit {

	@Output() onSelectLancamento = new EventEmitter<Lancamento>();

	lancamentos: Lancamento[] = [];

	constructor(private lancamentosService: LancamentosService, private route: ActivatedRoute, private router: Router) { }

	ngOnInit() {

		this.lancamentos.push(new Lancamento('1', 'Pipoca', 10.99, new Conta('58a355ab3fa0e022b0b5c523', 'Conta Conjunta'), new Date(), true));
		this.lancamentos.push(new Lancamento('2', 'Sorvete', 1.99, new Conta('2', 'ITAU'), new Date(), true));
		this.lancamentos.push(new Lancamento('3', 'Pizza', 60.00, new Conta('58a5c2f2d4e1940bac7a81e4', 'Santander'), new Date(), false));
	}

	onSelect(lancamento: Lancamento) {

		this.onSelectLancamento.emit(lancamento);
	}
}
