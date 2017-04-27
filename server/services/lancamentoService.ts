import { ObjectID } from "mongodb";
import { Service } from 'typedi';
import * as logger from 'logops';
import { Container } from 'typedi';
import * as assert from "assert";
import * as moment from 'moment';

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

		//Salva somente o _id e nome da categoria no lancamento
		let novaCategoria = { _id: lancamento.categoria._id, nome: lancamento.categoria.nome };
		lancamento.categoria = novaCategoria;

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

		let query = { _id: new ObjectID(idLancamento) }

		let novoLancamento = {
			data: moment(lancamento.data, 'YYYY-MM-DD').toDate(),
			descricao: lancamento.descricao,
			valor: lancamento.valor,
			conta: lancamento.conta,
			categoria: { _id: lancamento.categoria._id, nome: lancamento.categoria.nome },
			isDebito: lancamento.isDebito
		}

		logger.info("** typeof UPDATED LANCAMENTO: %j", novoLancamento);
		let daoReturn = yield this.lancamentoDAO.updateLancamento(query, { $set: novoLancamento });
		assert.equal(daoReturn.result.n, 1);

		let lancamentoAlterado = yield this.lancamentoDAO.getLancamentoByDescricao(lancamento.descricao);
		assert.ok(lancamentoAlterado);

		return lancamentoAlterado;
	}
}
