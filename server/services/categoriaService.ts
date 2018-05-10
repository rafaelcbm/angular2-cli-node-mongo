import { ObjectID } from "mongodb";
import { Service } from 'typedi';
import * as logger from 'logops';
import { Container } from 'typedi';
import * as assert from "assert";

import { BusinessError } from './../commons/businessError';
import { UserDAO, CategoriaDAO, LancamentoDAO } from '../dal/DAOs';

@Service()
export class CategoriaService {

	categoriaDAO = Container.get(CategoriaDAO);
	userDAO = Container.get(UserDAO);
	lancamentoDAO = Container.get(LancamentoDAO);

	public async getArvoreCategorias(userName: string) {

		let user = await this.userDAO.getUser(userName);
		assert.ok(user);

		let userId = user._id.toString();
		let raizes = await this.categoriaDAO.getCategoriasRaiz(userId);
		assert.ok(raizes);

		let categorias = [].concat(raizes);
		let arvoreCategorias = [].concat(raizes);

		for (var i = 0; i < categorias.length; i++) {

			let categoriaAtual = categorias[i];

			let filhas = await this.categoriaDAO.getCategoriasFilhas(userId, categoriaAtual.nome);
			if (filhas.length > 0) {
				categoriaAtual.children = [];
				filhas.forEach(filha => categoriaAtual.children.push(filha));
				categorias = categorias.concat(filhas);
			}
		}

		return arvoreCategorias;
	}

	public async getCategorias(userName: string) {

		let user = await this.userDAO.getUser(userName);
		assert.ok(user);

		let userId = user._id.toString();
		let categorias = await this.categoriaDAO.getCategoriasByUser(user._id.toString());

		return categorias;
	}

	public async insertCategoria(userName: string, novaCategoria: any) {

		let user = await this.userDAO.getUser(userName);
		assert.ok(user);

		let categorias = await this.categoriaDAO.getCategoriasByUser(user._id.toString());
		if (categorias.length > 0 && categorias.find(categoria => categoria.nome === novaCategoria.nome)) {
			throw new BusinessError(`Usuário já possui categoria com o nome informado: "${novaCategoria.nome}".`);
		}

		novaCategoria._idUser = user._id.toString();
		let daoReturn = await this.categoriaDAO.insertCategoria(novaCategoria);
		assert.equal(daoReturn.result.n, 1);

		return await this.getArvoreCategorias(userName);
	}

	public async removeCategoria(userName: string, idCategoria: any) {

		let user = await this.userDAO.getUser(userName);
		assert.ok(user);

		let categoria = await this.categoriaDAO.getCategoriaById(idCategoria);

		if (categoria && categoria._idUser !== user._id.toString()) {
			throw new BusinessError(`Categoria não pertence ao usuário informado!`);
		}

		let catFilhas = await this.categoriaDAO.getCategoriasFilhas(user._id.toString(), categoria.nome);
		if (catFilhas.length > 0) {
			let daoReturn = await this.categoriaDAO.removeCategoriasFilhas(categoria.nome);
		}

		let daoReturn = await this.categoriaDAO.removeCategoriaById(idCategoria);
		assert.equal(daoReturn.result.n, 1);

		// Atualiza os lançamentos com a categoria padrão 'Sem Categoria'
		let query = { $and: [{ _idUser: user._id.toString() }, { "categoria.nome": categoria.nome }] };
		let resultLancamentoUpdated = await this.lancamentoDAO.updateLancamento(query, { $set: { "categoria.nome": 'Sem Categoria' } });

		return await this.getArvoreCategorias(userName);
	}

	public async updateCategoria(userName: string, idCategoria: any, novoNomeCategoria: string) {

		let user = await this.userDAO.getUser(userName);
		assert.ok(user);

		let categorias = await this.categoriaDAO.getCategoriasByUser(user._id.toString());

		let categoria = categorias.find(categoria => categoria._id.toString() === idCategoria);

		if (categorias.length > 0 && !categoria)
			throw new BusinessError(`Categoria não encontrada para o usuário informado!`);

		if (categorias.find(categoria => categoria.nome === novoNomeCategoria))
			throw new BusinessError(`Usuário já possui categoria com o nome informado: "${novoNomeCategoria}".`);

		// Adiciona referencias nos filhos do novo nome
		let query: any = { $and: [{ _idUser: user._id.toString() }, { ancestrais: categoria.nome }] };
		await this.categoriaDAO.updateCategoria(query, { $push: { ancestrais: novoNomeCategoria } });

		// Remove referencias nos filhos do nome antigo
		query = { $and: [{ _idUser: user._id.toString() }, { ancestrais: categoria.nome }] };
		await this.categoriaDAO.updateCategoria(query, { $pull: { ancestrais: categoria.nome } });
		//query = { pai: categoria.nome };
		query = { $and: [{ _idUser: user._id.toString() }, { pai: categoria.nome }] };
		await this.categoriaDAO.updateCategoria(query, { $set: { pai: novoNomeCategoria } });

		// Atualiza de fato o nome da categoria
		query = { _id: new ObjectID(idCategoria) };
		let daoReturn = await this.categoriaDAO.updateCategoria(query, { $set: { nome: novoNomeCategoria } });
		assert.equal(daoReturn.result.n, 1);

		// Atualiza os lançamentos com o novo nome da categoria
		query = { $and: [{ _idUser: user._id.toString() }, { "categoria.nome": categoria.nome }] };
		let resultLancamentoUpdated = await this.lancamentoDAO.updateLancamento(query, { $set: { "categoria.nome": novoNomeCategoria } });
		logger.info('* Quantidade de lançamentos atualizados com nova categoria = %j', resultLancamentoUpdated.result.n);

		return await this.getArvoreCategorias(userName);
	}
}
