import { length } from './../config';
import { ObjectID } from "mongodb";
import { Service, Inject } from 'typedi';
import * as logger from 'logops';
import { Container } from 'typedi';
import * as co from "co";
import * as assert from "assert";
import * as _ from "lodash";

import { UserDAO } from '../dal/userDAO';
import { CategoriaDAO } from "../dal/categoriaDAO";

@Service()
export class CategoriaService {

	categoriaDAO = Container.get(CategoriaDAO);
	userDAO = Container.get(UserDAO);

	public *obterArvoreCategorias(userName: string) {

		let user = yield this.userDAO.getUser(userName);
		assert.ok(user);

		let userId = user._id.toString();
		let raizes = yield this.categoriaDAO.getCategoriasRaiz(userId);
		assert.ok(raizes);

		let categorias = [].concat(raizes);
		let arvoreCategorias = [].concat(raizes);

		for (var i = 0; i < categorias.length; i++) {

			let categoriaAtual = categorias[i];

			let filhas = yield this.categoriaDAO.getCategoriasFilhas(userId, categoriaAtual.nome);
			if (filhas.length > 0) {
				categoriaAtual.children = [];
				filhas.forEach(filha => categoriaAtual.children.push(filha));
				categorias = categorias.concat(filhas);
			}
		}

		return arvoreCategorias;
	}

	public *salvarCategoria(userName: string, novaCategoria: any) {

		let user = yield this.userDAO.getUser(userName);
		assert.ok(user);

		let categorias = yield this.categoriaDAO.getCategoriasByUser(user._id.toString());
		if (categorias.length > 0 && categorias.find(categoria => categoria.nome === novaCategoria.nome)) {
			throw new Error(`Usuário já possui categoria com o nome informado: "${novaCategoria.nome}".`);
		}

		novaCategoria._idUser = user._id.toString();
		let daoReturn = yield this.categoriaDAO.insertCategoria(novaCategoria);
		assert.equal(daoReturn.result.n, 1);

		return yield this.obterArvoreCategorias(userName);
	}

	public *removeCategoria(userName: string, idCategoria: any) {

		let user = yield this.userDAO.getUser(userName);
		assert.ok(user);

		let categoria = yield this.categoriaDAO.getCategoriaById(idCategoria);

		if (categoria && categoria._idUser !== user._id.toString()) {
			throw new Error(`Categoria não pertence ao usuário informado!`);
		}

		let catFilhas = yield this.categoriaDAO.getCategoriasFilhas(user._id.toString(), categoria.nome);
		if (catFilhas.length > 0) {
			let daoReturn = yield this.categoriaDAO.removeCategoriasFilhas(categoria.nome);
		}

		let daoReturn = yield this.categoriaDAO.removeCategoriaById(idCategoria);
		assert.equal(daoReturn.result.n, 1);

		return yield this.obterArvoreCategorias(userName);
	}

	public *updateCategoria(userName: string, idCategoria: any, nomeCategoria: string) {

		let user = yield this.userDAO.getUser(userName);
		assert.ok(user);

		let categorias = yield this.categoriaDAO.getCategoriasByUser(user._id.toString());

		if (categorias.length > 0 && !categorias.find(categoria => categoria._id.toString() === idCategoria))
			throw new Error(`Categoria não encontrada para o usuário informado!`);

		if (categorias.find(categoria => categoria.nome === nomeCategoria))
			throw new Error(`Usuário já possui categoria com o nome informado: "${nomeCategoria}".`);

		let daoReturn = yield this.categoriaDAO.updateCategoria(idCategoria, nomeCategoria);
		assert.equal(daoReturn.result.n, 1);

		return yield this.obterArvoreCategorias(userName);
	}
}
