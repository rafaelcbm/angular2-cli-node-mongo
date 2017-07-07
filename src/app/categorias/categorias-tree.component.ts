import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';

import { TreeComponent, TREE_ACTIONS, IActionMapping, KEYS } from "angular-tree-component/dist/angular-tree-component";

import { LancamentosService } from '../services/lancamentos.service';
import { CategoriasService } from './../services/categorias.service';
import { FiltroLancamentoService } from "../lancamentos/filtro-lancamento.service";

@Component({
	selector: 'categorias-tree',
	templateUrl: './categorias-tree.component.html',
	styleUrls: ['./categorias-tree.component.scss']
})
export class CategoriasTreeComponent implements OnInit {

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

	categorias: any[];

	constructor(private categoriasService: CategoriasService, private filtroLancamentoService: FiltroLancamentoService) { }

	ngOnInit() {
		//Atualiza as categorias do serviço
		this.categoriasService.dataObservable$.subscribe(categorias => {
			this.categorias = categorias;
			this.tree.treeModel.update();
		});

		this.categoriasService.retrieve();
	}

	add(node, indexNode) {
		node.data.operacao = 'add';
		this.toogleEdit(node);
	}

	edit(node, indexNode) {
		node.data.operacao = 'edit';
		this.toogleEdit(node);
	}

	saveNode(node, indexNode) {
		if (node.data.operacao === 'add') {
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
			newNode.ancestrais.reverse();

			this.categoriasService.create({ novaCategoria: newNode });

		} else if (node.data.operacao === 'edit') {
			node.data.nome = node.data.novoNome;
			this.categoriasService.update(node.data._id, { nomeCategoria: node.data.nome });
		}

		this.toogleEdit(node);
	}

	remove(node, indexNode) {
		this.categoriasService.remove(node.data._id);
	}

	clearTempData(node) {
		node.data.novoNome = '';
		node.data.operacao = '';
	}

	toogleEdit(node) {
		node.data.showEdit = !node.data.showEdit;
		if (!node.data.showEdit) {
			this.clearTempData(node);
		}
	}

	onActivate($event) {
		$event.node.data.showBars = true;
		$event.node.data.showOptions = false;

		this.notificarCategoriasSelecionadas();
	}

	onDeactivate($event, node) {

		//TODO: Alterar a forma de passar esses dados, gerenciando no serviço atraves de um array !
		// utilizar a propriedade: $event.target.lastChild.data para obter o nome da categoria.

		console.log('deac event', event);
		console.log('deac event', node);

		$event.node.data.showBars = false;
		$event.node.data.showOptions = false;

		this.notificarCategoriasSelecionadas();
	}

	notificarCategoriasSelecionadas() {
		let filtrados;
		if (this.tree.treeModel.activeNodes.length > 0) {
			filtrados = this.tree.treeModel.activeNodes.map(item => item.data.nome);
		} else {
			console.log('nos = ', this.tree.treeModel.nodes);
			filtrados = this.tree.treeModel.nodes.map(item => item.nome);
		}
		this.filtroLancamentoService.onSelectedCategorias(filtrados);
	}

	clickBars(node) {
		node.data.showBars = false;
		node.data.showOptions = true;
	}
}
