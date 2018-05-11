import { randomBytes } from 'crypto';
import { length } from './../config';
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

	public getLancamentos(userName: string) {

		return this.userDAO.getUser(userName)
			.then(user => this.lancamentoDAO.getLancamentosByUser(user._id.toString()));
	}

	public getLancamentosByCompetencia(userName: string, competencia: string) {

		return this.userDAO.getUser(userName)
			.then(user => this.lancamentoDAO.getLancamentosByCompetencia(user._id.toString(), competencia));
	}

	public insertLancamento(userName: string, lancamento: any) {

		let lancamentoInserido;
		let usuario;
		let competenciaAtual;
		let isCompetenciaAtualExistente;

		return this.userDAO.getUser(userName)
			.then(user => {
				assert.ok(user);
				if (!user.contas)
					return Promise.reject(new BusinessError(`Usuário não possui contas cadastradas! Favor crie uma conta antes cadastrar um lançamento!`));
				else {
					usuario = user;
					// Transforma o _id para String
					lancamento._idUser = user._id.toString();

					//Salva somente o _id e nome da categoria no lancamento
					let categoriaLancamento = { _id: lancamento.categoria._id, nome: lancamento.categoria.nome };
					lancamento.categoria = categoriaLancamento;

					return this.lancamentoDAO.insertLancamento(lancamento)
				}
			})
			.then(resultInsercaoLancamento => {
				let insertedLancamento = resultInsercaoLancamento.ops[0];
				assert.equal(resultInsercaoLancamento.result.n, 1);
				lancamentoInserido = insertedLancamento;

				competenciaAtual = parseInt(moment(lancamentoInserido.data).format('YYYYMM'));

				//Upsert Compentecia
				return this.lancamentoDAO.getCompetencia(usuario._id.toString(), competenciaAtual);
			})
			.then(compAtual => {
				if (compAtual) {
					isCompetenciaAtualExistente = true;

					compAtual.saldo += lancamentoInserido.valor;

					let query: any = { $and: [{ _idUser: usuario._id.toString() }, { competencia: compAtual.competencia }] };
					return this.lancamentoDAO.updateCompetencia(query, { $set: { saldo: compAtual.saldo } });
				} else {
					isCompetenciaAtualExistente = false;
					//Obter Ultima Comp anterior
					return this.lancamentoDAO.obterUltimaCompetenciaAnterior(usuario._id.toString(), competenciaAtual);
				}
			}).then(compAnterior => {
				if (!isCompetenciaAtualExistente) {
					let novaCompetencia: any = {
						competencia: competenciaAtual,
						saldo: 0,
						_idUser: usuario._id.toString()
					};
					if (compAnterior) {
						novaCompetencia.saldo = compAnterior.saldo + lancamentoInserido.valor
					}
					return this.lancamentoDAO.insertCompetencia(novaCompetencia);
				}
			})
			.then(r => {
				return this.lancamentoDAO.obterCompetenciasPosteriores(usuario._id.toString(), competenciaAtual);
			})
			.then(competencias => {
				if (competencias) {
					let promises = competencias.map(c => {
						c.saldo += lancamentoInserido.valor;

						let query: any = { $and: [{ _idUser: usuario._id.toString() }, { competencia: c.competencia }] };
						return this.lancamentoDAO.updateCompetencia(query, { $set: { saldo: c.saldo } });
					});

					return Promise.all(promises);
				}
			})
			.then(resultadosUpdateCompentecias => {
				return lancamentoInserido;
			});
	}


	public removeLancamento(userName: string, idLancamento: any) {

		let lancamentoObtido;

		return this.lancamentoDAO.getLancamentoById(idLancamento)
			.then(lancamento => {
				logger.info("** Remover Lancamentos - lancamento = %j", lancamento);
				if (!lancamento)
					return Promise.reject(new BusinessError('Lancamento não encontrado!'))
				else {
					lancamentoObtido = lancamento;
					return this.userDAO.getUser(userName);
				}
			})
			.then(user => {
				assert.ok(user);
				if (user._id.toHexString() != lancamentoObtido._idUser)
					return Promise.reject(new BusinessError(`Lancamento (${lancamentoObtido.nome}) não pertence ao usuário informado!`));
				else
					return this.lancamentoDAO.removeLancamentoById(idLancamento);
			})
			.then(resultRemocaoLancamento => assert.equal(resultRemocaoLancamento.result.n, 1));
	}

	public updateLancamento(userName: string, idLancamento: any, lancamento: any) {

		let lancamentoObtido;

		return this.userDAO.getUser(userName)
			.then(user => {
				assert.ok(user);
				if (!user.contas)
					return Promise.reject(new BusinessError(`Usuário não possui contas cadastradas! Favor crie uma conta antes cadastrar um lançamento!`));
				else {
					let contaLancamento = user.contas.find(conta => conta === lancamento.conta._id);

					if (!contaLancamento)
						return Promise.reject(new BusinessError(`Lancamento informado não pertence a uma conta do usuário!`));

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

					return this.lancamentoDAO.updateLancamento(query, { $set: novoLancamento });
				}
			})
			.then((resultLancamentoUpdated) => {
				assert.equal(resultLancamentoUpdated.result.n, 1);
				return this.lancamentoDAO.getLancamentoByDescricao(lancamento.descricao);
			});
	}

	public consolidarLancamento(userName: string, idLancamento: any, lancamentoPago: any) {

		let lancamentoObtido;

		return this.lancamentoDAO.getLancamentoById(idLancamento)
			.then(lancamento => {
				logger.info("** Consolidando Lancamento = %j", lancamento);
				if (!lancamento)
					return Promise.reject(new BusinessError('Lancamento não encontrado!'))
				else {
					lancamentoObtido = lancamento;
					return this.userDAO.getUser(userName);
				}
			})
			.then(user => {
				assert.ok(user);
				if (user._id.toHexString() != lancamentoObtido._idUser)
					return Promise.reject(new BusinessError(`Lancamento (${lancamentoObtido.nome}) não pertence ao usuário informado!`));
				else {

					let query = { _id: new ObjectID(idLancamento) };
					// Converte o tipo de string para boolean
					lancamentoPago = (lancamentoPago === 'true');

					return this.lancamentoDAO.updateLancamento(query, { $set: { pago: lancamentoPago } });
				}
			})
			.then((resultLancamentoUpdated) => {
				assert.equal(resultLancamentoUpdated.result.n, 1);
				return this.lancamentoDAO.getLancamentoByDescricao(lancamentoObtido.descricao);
			});
	}

	public obterUltimaCompetenciaAnterior(userName, competencia) {
		return this.userDAO.getUser(userName)
			.then(user => {
				assert.ok(user);
				return this.lancamentoDAO.obterUltimaCompetenciaAnterior(user._id.toString(), +competencia);
			})
			.then(comp => {
				if (!comp) {
					return { competencia: 0, saldo: 0.0 };
				}
				return { competencia: comp.competencia, saldo: comp.saldo };
			});
	}

	public obterCompetencia(userName, competencia) {
		return this.userDAO.getUser(userName)
			.then(user => {
				assert.ok(user);
				logger.info("** Obtendo Competencia = %s", competencia);
				return this.lancamentoDAO.getCompetencia(user._id.toString(), +competencia);
			})
			.then(competencia => {
				console.log('competencia = ', competencia);
				if (!competencia) {
					return { competencia, saldo: 0.0 };
				}
				return competencia;
			});
	}
}
