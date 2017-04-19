import { ObjectID } from "mongodb";
import { Service } from 'typedi';
import * as logger from 'logops';
import { Container } from 'typedi';
import * as assert from "assert";

import { BusinessError } from './../commons/businessError';
import { UserDAO } from '../dal/userDAO';
import { ContaDAO } from "../dal/contaDAO";

@Service()
export class ContaService {

	contaDAO = Container.get(ContaDAO);
	userDAO = Container.get(UserDAO);

	public *getContas(userName: string) {

		let user = yield this.userDAO.getUser(userName);
		assert.ok(user);

		if (!user.contas)
			return [];

		let contas = yield this.contaDAO.getContaByIds(user.contas);

		return contas;
	}

	public *insertConta(userName: string, nomeConta: string) {

		let user = yield this.userDAO.getUser(userName);
		assert.ok(user);
		//user._id é um OBJETO, nao string, apesar da exibição no log ser igual
		logger.info("** typeof user._id: %s", typeof user._id);

		if (user.contas) {
			let contas = yield this.contaDAO.getContaByIds(user.contas);
			if (contas.find(conta => conta.nome === nomeConta))
				throw new BusinessError(`Usuário já possui conta com o nome informado: "${nomeConta}".`);
		}

		let daoReturn = yield this.contaDAO.insertConta({ nome: nomeConta });
		assert.equal(daoReturn.result.n, 1);

		let contaObtida = yield this.contaDAO.getContaByNome(nomeConta);
		assert.ok(contaObtida);

		daoReturn = yield this.userDAO.addConta(user._id, contaObtida._id.toHexString());
		assert.equal(daoReturn.result.n, 1);

		return contaObtida;
	}

	public *removeConta(userName: string, idConta: any) {

		let contaObtida = yield this.contaDAO.getContaById(idConta);

		if (!contaObtida)
			throw new BusinessError("Conta não encontrada!");

		let user = yield this.userDAO.getUser(userName);

		if (user.contas) {
			let contasUsuario = user.contas.filter(conta => conta == idConta);
			if (contasUsuario.length == 0)
				throw new BusinessError(`Conta (${contaObtida.nome}) não pertence ao usuário informado!`);
		}

		let daoReturn = yield this.contaDAO.removeContaById(idConta);
		assert.equal(daoReturn.result.n, 1);

		daoReturn = yield this.userDAO.removeConta(user._id, contaObtida._id.toHexString());
		assert.equal(daoReturn.result.n, 1);

		user = yield this.userDAO.getUser(userName);
		assert.ok(user);

		return user;
	}

	public *updateConta(userName: string, idConta: string, nomeConta: string) {

		let user = yield this.userDAO.getUser(userName);
		assert.ok(user);

		if (user.contas) {
			let contasUsuario = user.contas.filter(conta => conta == idConta);

			if (contasUsuario.length == 0)
				throw new BusinessError("Conta informada não pertence ao usuário informado!");
		}

		let contas = yield this.contaDAO.getContaByIds(user.contas);
		if (contas.find(conta => conta.nome === nomeConta))
			throw new BusinessError(`Usuário já possui conta com o nome informado: "${nomeConta}".`);

		let daoReturn = yield this.contaDAO.updateConta(idConta, nomeConta);
		assert.equal(daoReturn.result.n, 1);

		let contaAlterada = yield this.contaDAO.getContaByNome(nomeConta);
		assert.ok(contaAlterada);

		return contaAlterada;
	}
}
