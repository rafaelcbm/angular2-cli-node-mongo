import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { ContasService } from '../services/contas-service';
import { Conta } from "../models/models.module";


@Component({
	selector: 'contas-list',
	templateUrl: './contas-list.component.html'
})
export class ContasListComponent implements OnInit {

	contas$: Observable<Conta[]>;

	contas: any[] = [];
	public selectedId: string;

	constructor(private contasService: ContasService, private route: ActivatedRoute, private router: Router) { }

	ngOnInit() {
		this.contas$ = this.contasService.contas; // subscribe to entire collection
		// this.singleTodo$ = this.todoService.todos
		// 	.map(todos => todos.find(item => item.id === '1'));
		// subscribe to only one todo 

		this.contasService.getAllContas();    // load all todos
		//this.todoService.load('1');    // load only todo with id of '1'
	}

	// ngOnInit() {

	// 	this.contasService.getContas()
	// 		.then(contas => this.contas = contas);
	// }

	onSelect(conta: Conta) {
		this.selectedId = conta.id;
		// Navigate with relative link
		this.router.navigate([conta.id], { relativeTo: this.route });
	}
}
