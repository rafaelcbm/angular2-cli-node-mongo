import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { TreeComponent } from "angular-tree-component/dist/angular-tree-component";

import { Log } from './../util/log';
import { LancamentosService } from '../services/lancamentos.service';
import { FiltroLancamentoService } from './filtro-lancamento.service';
import { Lancamento } from "../models/models.module";

@Component({
	selector: 'lancamentos-list',
	templateUrl: './lancamentos-list.component.html'
})
export class LancamentosListComponent implements OnInit {

	@Output() onSelectLancamento = new EventEmitter<Lancamento>();

	@ViewChild(TreeComponent)
	private tree: TreeComponent;

	lancamentos$: Observable<Lancamento[]>;

	nodes: any = [
		{
			id: 1,
			name: 'Despesas',
			isExpanded: true,
			children: [
				{ id: 2, name: 'Alimentação' },
				{ id: 3, name: 'Lazer' },
				{ id: 4, name: 'Transporte' }
			]
		},
		{
			id: 5,
			name: 'Receitas',
			children: [
				{ id: 6, name: 'Salário' },
				{
					id: 7, name: 'Ticket',
					children: [
						{ id: 8, name: 'Alimentação' },
						{ id: 9, name: 'Refeição' }
					]
				}
			]
		}
	];

	constructor(private lancamentosService: LancamentosService, private filtroLancamentoService: FiltroLancamentoService) {
	}

	ngOnInit() {

		this.lancamentos$ = this.lancamentosService.dataObservable$;

		this.filtroLancamentoService.competenciaLancamento$
			.debounceTime(500)
			.distinctUntilChanged()
			.subscribe(
			novaCompetencia => {
				Log.info('Nova competência informada:', novaCompetencia)
				this.lancamentosService.getByCompetencia(novaCompetencia);
			}
			)

		let competenciaAtual = moment().format('YYYYMM')
		console.log('*** competenciaAtual', competenciaAtual);
		this.lancamentosService.getByCompetencia(competenciaAtual);
	}

	onSelect(lancamento: Lancamento) {
		this.onSelectLancamento.emit(lancamento);
	}

	edit(node, indexNode) {
		Log.log('EDIT node: ', node);
		this.toogleEdit(node);
	}

	remove(node, indexNode) {
		Log.log('REMOVE node: ', node);

		node.parent.children.splice(indexNode,1);
		this.tree.treeModel.update();
	}

	add(node, indexNode) {
		Log.log('ADD node: ', node);

		this.toogleEdit(node);
	}

	saveNewNode(node, indexNode) {
		Log.log('saveNewNode node: ', node);

		if (!node.data.children) {
			node.data.children = [];

		}

		let newNode = { id: 123, name: 'NOVO LANCAMENTO' };
		node.data.children.push(newNode);


		this.tree.treeModel.update();

		this.toogleEdit(node);
	}

	toogleEdit(node) {
		node.data.showEdit = !node.data.showEdit;
	}
}
