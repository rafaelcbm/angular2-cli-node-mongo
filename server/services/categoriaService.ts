import { ObjectID } from "mongodb";
import { Service } from 'typedi';
import * as logger from 'logops';
import { Container } from 'typedi';
import * as assert from "assert";

import { BusinessError } from './../commons/businessError';
import { UserDAO } from '../dal/userDAO';
import { CategoriaDAO } from "../dal/categoriaDAO";

@Service()
export class CategoriaService {

	categoriaDAO = Container.get(CategoriaDAO);
	userDAO = Container.get(UserDAO);

	public *getArvoreCategorias(userName: string) {

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

	public *getCategorias(userName: string) {

		let user = yield this.userDAO.getUser(userName);
		assert.ok(user);

		let userId = user._id.toString();
		let categorias = yield this.categoriaDAO.getCategoriasByUser(user._id.toString());

		return categorias;
	}

	public *insertCategoria(userName: string, novaCategoria: any) {

		let user = yield this.userDAO.getUser(userName);
		assert.ok(user);

		let categorias = yield this.categoriaDAO.getCategoriasByUser(user._id.toString());
		if (categorias.length > 0 && categorias.find(categoria => categoria.nome === novaCategoria.nome)) {
			throw new BusinessError(`Usuário já possui categoria com o nome informado: "${novaCategoria.nome}".`);
		}

		novaCategoria._idUser = user._id.toString();
		let daoReturn = yield this.categoriaDAO.insertCategoria(novaCategoria);
		assert.equal(daoReturn.result.n, 1);

		return yield this.getArvoreCategorias(userName);
	}

	public *removeCategoria(userName: string, idCategoria: any) {

		let user = yield this.userDAO.getUser(userName);
		assert.ok(user);

		let categoria = yield this.categoriaDAO.getCategoriaById(idCategoria);

		if (categoria && categoria._idUser !== user._id.toString()) {
			throw new BusinessError(`Categoria não pertence ao usuário informado!`);
		}

		let catFilhas = yield this.categoriaDAO.getCategoriasFilhas(user._id.toString(), categoria.nome);
		if (catFilhas.length > 0) {
			let daoReturn = yield this.categoriaDAO.removeCategoriasFilhas(categoria.nome);
		}

		let daoReturn = yield this.categoriaDAO.removeCategoriaById(idCategoria);
		assert.equal(daoReturn.result.n, 1);

		return yield this.getArvoreCategorias(userName);
	}

	public *updateCategoria(userName: string, idCategoria: any, novoNomeCategoria: string) {

		let user = yield this.userDAO.getUser(userName);
		assert.ok(user);

		let categorias = yield this.categoriaDAO.getCategoriasByUser(user._id.toString());

		let categoria = categorias.find(categoria => categoria._id.toString() === idCategoria);

		if (categorias.length > 0 && !categoria)
			throw new BusinessError(`Categoria não encontrada para o usuário informado!`);

		if (categorias.find(categoria => categoria.nome === novoNomeCategoria))
			throw new BusinessError(`Usuário já possui categoria com o nome informado: "${novoNomeCategoria}".`);

		// Adiciona referencias nos filhos do novo nome
		let query: any = { ancestrais: categoria.nome };
		yield this.categoriaDAO.updateCategoria(query, { $push: { ancestrais: novoNomeCategoria } });

		// Remove referencias nos filhos do nome antigo
		query = { _idUser: user._id.toString() };
		yield this.categoriaDAO.updateCategoria(query, { $pull: { ancestrais: categoria.nome } });
		query = { pai: categoria.nome };
		yield this.categoriaDAO.updateCategoria(query, { $set: { pai: novoNomeCategoria } });

		// Atualiza de fato o nome da categoria
		query = { _id: new ObjectID(idCategoria) };
		let daoReturn = yield this.categoriaDAO.updateCategoria(query, { $set: { nome: novoNomeCategoria } });
		assert.equal(daoReturn.result.n, 1);


		return yield this.getArvoreCategorias(userName);
	}
}
