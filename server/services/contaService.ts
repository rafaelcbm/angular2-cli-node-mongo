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

	errMessages = {
		usuarioSemContas: 'Usuário sem contas.'
	};

	public getContas(userName: string) {

		return this.userDAO.getUser(userName)
			.then(user => {
				assert.ok(user);
				if (!user.contas)
					return Promise.reject(this.errMessages.usuarioSemContas)//return [];
				return user.contas;
			})
			.then(idsContasUsuario => this.contaDAO.getContaByIds(idsContasUsuario))
			.then(null, err => (err == this.errMessages.usuarioSemContas) ? [] : err); //captura o possível caso de o usuário não possuir contas, anteriormente lançado.
	}

	public insertConta(userName: string, nomeConta: string) {

		let user;
		let contaInserida;

		return this.userDAO.getUser(userName)
			.then(usr => {
				assert.ok(usr);
				user = usr;
				//usr._id é um OBJETO, nao string, apesar da exibição no log ser igual
				//logger.info("** typeof usr._id: %s", typeof usr._id);
				if (usr.contas) {
					return this.contaDAO.getContaByIds(usr.contas)
						.then(contas => {
							if (contas.find(conta => conta.nome === nomeConta))
								return Promise.reject(new BusinessError(`Usuário já possui conta com o nome informado: "${nomeConta}".`))
						});
				}
			})
			.then(() => this.contaDAO.insertConta({ nome: nomeConta }))
			.then((resultInsercaoConta) => {
				assert.equal(resultInsercaoConta.result.n, 1);
				return this.contaDAO.getContaByNome(nomeConta)
			})
			.then((contaObtida) => {
				assert.ok(contaObtida);
				contaInserida = contaObtida;
				return this.userDAO.addConta(user._id, contaObtida._id.toHexString());
			})
			.then((resultInsercaoConta) => {
				assert.equal(resultInsercaoConta.result.n, 1);
				return contaInserida;
			});
	}

	public removeConta(userName: string, idConta: any) {

		let contaObtida;
		let user;

		return this.contaDAO.getContaById(idConta)
			.then(conta => {
				if (!conta)
					return Promise.reject(new BusinessError('Conta não encontrada!'));
				contaObtida = conta;
			})
			.then(() => this.userDAO.getUser(userName))
			.then((usr) => {
				user = usr;
				if (usr.contas) {
					let contasUsuario = usr.contas.filter(conta => conta == idConta);
					if (contasUsuario.length == 0)
						return Promise.reject(new BusinessError(`Conta (${contaObtida.nome}) não pertence ao usuário informado!`));
				}
			})
			.then(() => this.contaDAO.removeContaById(idConta))
			.then((resultContaRemovida) => {
				assert.equal(resultContaRemovida.result.n, 1);
				return this.userDAO.removeConta(user._id, contaObtida._id.toHexString());
			})
			.then((resultContaUsuarioRemovida) => {
				assert.equal(resultContaUsuarioRemovida.result.n, 1);
				return this.userDAO.getUser(userName);
			});
	}

	public updateConta(userName: string, idConta: string, nomeConta: string) {

		let contaObtida;
		let user;

		return this.contaDAO.getContaById(idConta)
			.then(conta => {
				if (!conta)
					return Promise.reject(new BusinessError('Conta não encontrada!'));
				contaObtida = conta;
			})
			.then(() => this.userDAO.getUser(userName))
			.then((usr) => {
				user = usr;
				if (usr.contas) {
					let contasUsuario = usr.contas.filter(conta => conta == idConta);
					if (contasUsuario.length == 0)
						return Promise.reject(new BusinessError(`Conta informada não pertence ao usuário informado!`));
				}
			})
			.then(() => this.contaDAO.getContaByIds(user.contas))
			.then((contas) => {
				if (contas.find(conta => conta.nome === nomeConta))
					return Promise.reject(new BusinessError(`Usuário já possui conta com o nome informado: "${nomeConta}".`));
				else
					return this.contaDAO.updateConta(idConta, nomeConta);
			})
			.then((resultContaUpdated) => {
				assert.equal(resultContaUpdated.result.n, 1);
				return this.contaDAO.getContaByNome(nomeConta);
			});
	}
}
