import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { TreeComponent, TREE_ACTIONS, IActionMapping, KEYS } from "angular-tree-component/dist/angular-tree-component";

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

	actionMapping: IActionMapping = {
		mouse: {
			click: TREE_ACTIONS.TOGGLE_SELECTED_MULTI
		}
	}


	newIndex = 999;

	lancamentos$: Observable<Lancamento[]>;

	options = {
		actionMapping: this.actionMapping
	};

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

	add(node, indexNode) {
		node.data.operation = 'add';
		this.toogleEdit(node);

	}

	edit(node, indexNode) {
		node.data.operation = 'edit';
		this.toogleEdit(node);
	}

	saveNode(node, indexNode) {
		Log.log('saveNode node: ', node);

		if (node.data.operation === 'add') {
			if (!node.data.children) {
				node.data.children = [];
			}

			let newNode = { id: this.newIndex++, name: node.data.newName };

			Log.log('saveNode newNode: ', newNode);
			node.data.children.push(newNode);
		} else if (node.data.operation === 'edit') {
			node.data.name = node.data.newName;
		}

		this.toogleEdit(node);
		this.tree.treeModel.update();
	}

	remove(node, indexNode) {
		let parent = node.parent;
		parent.data.children.splice(indexNode, 1);

		this.tree.treeModel.update();
	}

	clearTempData(node) {
		node.data.newName = '';
		node.data.operation = '';
	}

	toogleEdit(node) {
		node.data.showEdit = !node.data.showEdit;
		if (!node.data.showEdit) {
			this.clearTempData(node);
		}
	}
}
