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

	lancamentos$: Observable<Lancamento[]>;

	@ViewChild(TreeComponent)
	private tree: TreeComponent;

	actionMapping: IActionMapping = {
		mouse: {
			click: TREE_ACTIONS.TOGGLE_SELECTED_MULTI
		}
	}

	options = {
		actionMapping: this.actionMapping,
		idField: '_id',
		displayField: 'nome'
		//childrenField: 'subCategorias'
	};

	categorias: any[];

	constructor(private lancamentosService: LancamentosService, private filtroLancamentoService: FiltroLancamentoService, private categoriasService: CategoriasService) { }

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


	/** Trecho relativo a categorias */
	add(node, indexNode) {
		node.data.operacao = 'add';
		this.toogleEdit(node);
		//TODO: Filtrar nós para exibicao atraves dessa propriedade
		//Log.log('this.tree.treeModel.activeNodes = ', this.tree.treeModel.activeNodes);
	}

	edit(node, indexNode) {
		node.data.operacao = 'edit';
		this.toogleEdit(node);
	}

	saveNode(node, indexNode) {
		Log.log('saveNode node: ', node);

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

			Log.log('saveNode newNode: ', newNode);
			//node.data.children.push(newNode);
		} else if (node.data.operacao === 'edit') {
			node.data.nome = node.data.novoNome;
			this.categoriasService.update(node.data._id, { nomeCategoria: node.data.nome });
		}

		this.toogleEdit(node);
		this.toogleOptions(node);
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

	toogleOptions(node) {
		//node.data.showBars = !node.data.showOptions;
	}

	clickBars(node) {
		node.data.showBars = false;
		node.data.showOptions = true;
	}

	onDeactivate($event) {

		if (!$event.node.data.showEdit) {
			$event.node.data.showOptions = false;
			$event.node.data.showBars = true;
		}
	}
}
