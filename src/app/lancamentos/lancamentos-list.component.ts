import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { TreeComponent, TREE_ACTIONS, IActionMapping, KEYS } from "angular-tree-component/dist/angular-tree-component";

import { Log } from './../util/log';
import { LancamentosService } from '../services/lancamentos.service';
import { FiltroLancamentoService } from './filtro-lancamento.service';
import { Lancamento } from "../models/models.module";
import { CategoriasService } from './../services/categorias.service';

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



	lancamentos$: Observable<Lancamento[]>;

	options = {
		actionMapping: this.actionMapping,
		idField: '_id',
		displayField: 'nome'
		//childrenField: 'subCategorias'
	};

	//Temp data
	newIndex = Math.floor(Math.random() * 1000) + 1;
	categorias = [];
	// categorias: any = [
	// 	{
	// 		_id: 1,
	// 		nome: 'Despesas',
	// 		isExpanded: true,
	// 		children: [
	// 			{ _id: 2, nome: 'Alimentação' },
	// 			{ _id: 3, nome: 'Lazer' },
	// 			{ _id: 4, nome: 'Transporte' }
	// 		]
	// 	},
	// 	{
	// 		_id: 5,
	// 		nome: 'Receitas',
	// 		children: [
	// 			{ _id: 6, nome: 'Salário' },
	// 			{
	// 				_id: 7, nome: 'Ticket',
	// 				children: [
	// 					{ _id: 8, nome: 'Alimentação' },
	// 					{ _id: 9, nome: 'Refeição' }
	// 				]
	// 			}
	// 		]
	// 	}
	// ];

	constructor(private lancamentosService: LancamentosService, private filtroLancamentoService: FiltroLancamentoService, private categoriasService: CategoriasService) {
	}

	ngOnInit() {

		this.lancamentos$ = this.lancamentosService.dataObservable$;

		//Atualiza as categorias do serviço
		this.categoriasService.dataObservable$.subscribe(categorias => {
			this.categorias = categorias;
			this.tree.treeModel.update();
		});

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
		this.lancamentosService.getByCompetencia(competenciaAtual);

		this.categoriasService.retrieve();
	}

	onSelect(lancamento: Lancamento) {
		this.onSelectLancamento.emit(lancamento);
	}

	add(node, indexNode) {
		node.data.operation = 'add';
		this.toogleEdit(node);

		Log.log('this.tree.treeModel.activeNodes = ', this.tree.treeModel.activeNodes);

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

			let newNode: any = { nome: node.data.novoNome, pai: node.data.nome };
			newNode.ancestrais = [];
			let parent = node;
			while (parent.data.nome) {
				newNode.ancestrais.push(parent.data.nome);
				parent = parent.parent;
			}

			this.categoriasService.create({ novaCategoria: newNode });

			Log.log('saveNode newNode: ', newNode);
			node.data.children.push(newNode);
		} else if (node.data.operation === 'edit') {
			node.data.nome = node.data.novoNome;
		}

		this.toogleEdit(node);
		this.tree.treeModel.update();
	}

	remove(node, indexNode) {
		let parent = node.parent;
		parent.data.children.splice(indexNode, 1);

		this.tree.treeModel.update();

		this.categoriasService.remove(node.data._id);
	}

	clearTempData(node) {
		node.data.novoNome = '';
		node.data.operation = '';
	}

	toogleEdit(node) {
		node.data.showEdit = !node.data.showEdit;
		if (!node.data.showEdit) {
			this.clearTempData(node);
		}
	}
}
