import { length } from './../config';
import { ObjectID } from "mongodb";
import { Service, Inject } from 'typedi';
import * as logger from 'logops';
import { Container } from 'typedi';
import * as co from "co";
import * as assert from "assert";
import * as _ from "lodash";

import { UserDAO } from './../dal/userDAO';
import { CategoriaDAO } from "../dal/categoriaDAO";

@Service()
export class CategoriaService {

	@Inject() categoriaDAO: CategoriaDAO;

	//TODO
	public getArvoreCategoriasByUser(userId: string): any {

		let categorias = [];

	

		// co(function* () {
	let raizes = this.categoriaDAO.getCategoriasRaiz(userId);
		assert.ok(raizes);

		// 	categorias = categorias.concat(raizes);

		// 	for (var i = 0; i < categorias.length; i++) {

		// 		let filhas = yield this.categoriaDAO.getCategoriasFilhas(userId, categorias[i].nome);
		// 		assert.ok(filhas);
		// 		if (filhas.length > 0) {
		// 			categorias[i].children = new Array(filhas);
		// 			categorias = categorias.concat(filhas);
		// 		}
		// 	}

		// 	console.log('** Arvore de categorias = ', categorias);
		// 	return categorias;
		// }).catch((e) => {
		// 	logger.error("** Error = ", e);
		// });

		// let categorias: any = [
		// 	{
		// 		_id: 0,
		// 		nome: 'Sem Categoria'
		// 	},
		// 	{
		// 		_id: 1,
		// 		nome: 'Despesas',
		// 		isExpanded: true,
		// 		children: [
		// 			{ _id: '58ed8cc5c04de60c30e1a608', nome: 'Alimentação' },
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

		//return categorias;
	}
}
