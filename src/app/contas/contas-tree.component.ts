import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';

import { TreeComponent, TREE_ACTIONS, IActionMapping, KEYS } from "angular-tree-component/dist/angular-tree-component";

import { LancamentosService } from '../services/lancamentos.service';
import { ContasService } from './../services/contas.service';

@Component({
	selector: 'contas-tree',
	templateUrl: './contas-tree.component.html',
	styleUrls: ['./contas-tree.component.scss']
})
export class ContasTreeComponent implements OnInit {

	@ViewChild(TreeComponent)
	private tree: TreeComponent;

	actionMapping: IActionMapping = {
		mouse: {
			click: null,
			dblClick: TREE_ACTIONS.TOGGLE_SELECTED_MULTI
		}
	}

	options = {
		actionMapping: this.actionMapping,
		idField: '_id',
		displayField: 'nome'
	};

	contas: any[];

	constructor(private contasService: ContasService) { }

	ngOnInit() {
		//Atualiza as contas do serviço
		this.contasService.dataObservable$.subscribe(contas => {
			this.contas = contas;
			this.tree.treeModel.update();
		});

		this.contasService.retrieve();
	}
}
