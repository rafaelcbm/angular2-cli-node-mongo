import { length } from './../config';
import { Router, Request, Response, NextFunction } from "express";
import * as assert from "assert";
import * as co from "co";
import { Container } from 'typedi';
import * as logger from 'logops';

import { UserDAO } from "../dal/userDAO";
import { CategoriaDAO } from "../dal/categoriaDAO";
import { CategoriaService } from '../services/categoriaService';

const categoriaDAO: CategoriaDAO = Container.get(CategoriaDAO);
const categoriaService: CategoriaService = Container.get(CategoriaService);
const userDAO: UserDAO = Container.get(UserDAO);

export const categoriaRouter: Router = Router();

categoriaRouter.get("/", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

	let userName = request.userName;

	co(function* () {

		let user = yield userDAO.getUser(userName);
		assert.ok(user);

		let raizes = yield categoriaDAO.getCategoriasRaiz(user._id.toString());
		assert.ok(raizes);
		let categorias = [];

		categorias = categorias.concat(raizes);

		for (var i = 0; i < categorias.length; i++) {

			let filhas = yield categoriaDAO.getCategoriasFilhas(user._id.toString(), categorias[i].nome);
			assert.ok(filhas);
			if (filhas.length > 0) {
				categorias[i].children = new Array(filhas);
				categorias = categorias.concat(filhas);
			}
		}

		console.log('** Arvore de categorias = ', categorias);


		//let arvoreCategorias = yield categoriaService.getArvoreCategoriasByUser(user._id.toString());

		response.json({
			"status": "sucesso",
			"data": categorias
		});

	}).catch((e) => {
		logger.info("** Error = ", e);

		return response.json({
			"status": "erro",
			"message": "Erro ao obter categorias do usuário!"
		});
	});
});

// categoriaRouter.post("/", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

// 	let userName = request.userName;
// 	let novaCategoria = request.body.novaCategoria;

// 	logger.info("** categoriaRouter.userName = ", userName);
// 	logger.info("** categoriaRouter.novaCategoria = ", novaCategoria);

// 	co(function* () {

// 		let user = yield userDAO.getUser(userName);
// 		assert.ok(user);

// 		let categorias = yield categoriaDAO.getCategoriasByUser(user._id.toString());
// 		logger.info("** categorias: %j", categorias);
// 		if (categorias.length > 0 && categorias.find(categoria => categoria.nome === novaCategoria.nome)) {
// 			return response.json({
// 				"status": "erro",
// 				"message": `Usuário já possui categoria com o nome informado: "${novaCategoria.nome}".`
// 			});
// 		}

// 		novaCategoria._idUser = user._id.toString();
// 		let daoReturn = yield categoriaDAO.insertCategoria(novaCategoria);
// 		assert.equal(daoReturn.result.n, 1);

// 		let arvoreCategorias = yield categoriaService.getArvoreCategoriasByUser(user._id.toString());

// 		response.status(201).json({
// 			"status": "sucesso",
// 			"data": arvoreCategorias
// 		});
// 	}).catch((e) => {
// 		logger.info("** Error = ", e);

// 		return response.json({
// 			"status": "erro",
// 			"message": "Erro ao inserir categoria do usuário!"
// 		});
// 	});
// });

// categoriaRouter.delete("/:idCategoria", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

// 	let userName = request.userName;
// 	let idCategoria = request.params.idCategoria;
// 	logger.info("** categoriaRouter.idCategoria = ", idCategoria);

// 	co(function* () {

// 		let user = yield userDAO.getUser(userName);
// 		assert.ok(user);

// 		let categoria = yield categoriaDAO.getCategoriaById(idCategoria);

// 		if (categoria && categoria._idUser !== user._id.toString()) {
// 			return response.json({
// 				"status": "erro",
// 				"message": `Categoria não pertence ao usuário informado!`
// 			});
// 		}

// 		let daoReturn = yield categoriaDAO.removeCategoriaById(idCategoria);
// 		assert.equal(daoReturn.result.n, 1);

// 		let arvoreCategorias = yield categoriaService.getArvoreCategoriasByUser(user._id.toString());

// 		response.status(201).json({
// 			"status": "sucesso",
// 			"data": arvoreCategorias
// 		});
// 	}).catch((e) => {
// 		logger.info("** Error = ", e);

// 		return response.json({
// 			"status": "erro",
// 			"message": "Erro ao remover categoria do usuário!"
// 		});
// 	});
// });

// categoriaRouter.put("/:idCategoria", function (request: Request & { userName: string }, response: Response, next: NextFunction) {

// 	let userName = request.userName;
// 	let idCategoria = request.params.idCategoria;
// 	let nomeCategoria = request.body.nomeCategoria;

// 	co(function* () {

// 		let user = yield userDAO.getUser(userName);
// 		assert.ok(user);

// 		let categorias = yield categoriaDAO.getCategoriasByUser(user._id.toString());
// 		if (categorias.length > 0 && !categorias.find(categoria => categoria._id.toString() === idCategoria)) {
// 			return response.json({
// 				"status": "erro",
// 				"message": `Categoria não encontrada para o usuário informado!`
// 			});
// 		}

// 		if (categorias.find(categoria => categoria.nome === nomeCategoria)) {
// 			return response.json({
// 				"status": "erro",
// 				"message": `Usuário já possui categoria com o nome informado: "${nomeCategoria}".`
// 			});
// 		}

// 		let daoReturn = yield categoriaDAO.updateCategoria(idCategoria, nomeCategoria);
// 		assert.equal(daoReturn.result.n, 1);

// 		let arvoreCategorias = yield categoriaService.getArvoreCategoriasByUser(user._id.toString());

// 		response.status(201).json({
// 			"status": "sucesso",
// 			"data": arvoreCategorias
// 		});

// 	}).catch((e) => {
// 		logger.info("** Error = ", e);

// 		return response.json({
// 			"status": "erro",
// 			"message": "Erro ao alterar categoria do usuário!"
// 		});
// 	});
//});
