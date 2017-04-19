import { ObjectID } from "mongodb";
import { Service } from 'typedi';
import * as logger from 'logops';
import { Container } from 'typedi';
import * as assert from "assert";

import { BusinessError } from './../commons/businessError';
import { UserDAO } from '../dal/userDAO';
import { LancamentoDAO } from "../dal/lancamentoDAO";

@Service()
export class LancamentoService {

	lancamentoDAO = Container.get(LancamentoDAO);
	userDAO = Container.get(UserDAO);

	public *getLancamentos(userName: string) {

		let user = yield this.userDAO.getUser(userName);

		return yield this.lancamentoDAO.getLancamentosByUser(user._id.toString());
	}

	public *getLancamentosByCompetencia(userName: string, competencia: string) {

		let user = yield this.userDAO.getUser(userName);

		return yield this.lancamentoDAO.getLancamentoByCompetencia(user._id.toString(), competencia);
	}

	public *insertLancamento(userName: string, lancamento: any) {

		let user = yield this.userDAO.getUser(userName);
		assert.ok(user);

		// Transforma o _id para String
		lancamento._idUser = user._id.toString();
		logger.info("** typeof lancamento._idUser: %s", typeof lancamento._idUser);

		let daoReturn = yield this.lancamentoDAO.insertLancamento(lancamento);
		logger.info("** inserted obj: %j", daoReturn.ops[0]);
		let insertedLancamento = daoReturn.ops[0];
		assert.equal(daoReturn.result.n, 1);

		return insertedLancamento;
	}

	public *removeLancamento(userName: string, idLancamento: any) {

		let lancamentoObtido = yield this.lancamentoDAO.getLancamentoById(idLancamento);
		logger.info("** Remover Lancamentos - lancamentoObtido = %j", lancamentoObtido);
		if (!lancamentoObtido)
			throw new BusinessError("Lancamento não encontrado!");

		let user = yield this.userDAO.getUser(userName);
		assert.ok(user);

		if (user._id.toHexString() != lancamentoObtido._idUser)
			throw new BusinessError(`Lancamento (${lancamentoObtido.nome}) não pertence ao usuário informado!`);


		let daoReturn = yield this.lancamentoDAO.removeLancamentoById(idLancamento);
		assert.equal(daoReturn.result.n, 1);
	}

	public *updateLancamento(userName: string, idLancamento: any, lancamento: any) {

		let user = yield this.userDAO.getUser(userName);
		assert.ok(user);

		if (!user.contas)
			throw new BusinessError(`Usuário não possui contas cadastradas! Favor crie uma conta antes cadastrar um lançamento!`);


		let contaLancamento = user.contas.find(conta => conta === lancamento.conta._id);

		if (!contaLancamento)
			throw new BusinessError(`Lancamento informado não pertence a uma conta do usuário!`);


		let daoReturn = yield this.lancamentoDAO.updateLancamento(idLancamento, lancamento);
		assert.equal(daoReturn.result.n, 1);

		let lancamentoAlterado = yield this.lancamentoDAO.getLancamentoByDescricao(lancamento.descricao);
		assert.ok(lancamentoAlterado);

		return lancamentoAlterado;
	}
}
