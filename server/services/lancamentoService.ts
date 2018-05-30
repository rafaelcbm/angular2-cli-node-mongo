import { randomBytes } from 'crypto';
import { ObjectID } from "mongodb";
import * as logger from 'logops';
import * as assert from "assert";
import * as moment from 'moment';

import { length } from '../config/constants';
import { BusinessError } from './../commons/businessError';
import { UserDAO, LancamentoDAO } from '../dal/DAOs';

export class LancamentoService {

	lancamentoDAO = new LancamentoDAO();
	userDAO = new UserDAO();

	public getLancamentos(userName: string) {

		return this.userDAO.getUser(userName)
			.then(user => this.lancamentoDAO.getLancamentosByUser(user._id.toString()));
	}

	public getLancamentosByCompetencia(userName: string, competencia: string) {

		return this.userDAO.getUser(userName)
			.then(user => this.lancamentoDAO.getLancamentosByCompetencia(user._id.toString(), competencia));
	}

	public insertLancamento(userName: string, lancamento: any) {

		if (lancamento.qtdParcelas) {
			return this.insertLancamentoPeriodico(userName, lancamento);
		} else {
			return this.insertLancamentoIndividual(userName, lancamento);
		}
	}

	public insertLancamentoIndividual(userName: string, lancamento: any) {

		let competenciaAtual = parseInt(moment(lancamento.data, 'YYYY-MM-DD').format('YYYYMM'));
		let idUsuario;

		return this.userDAO.getUser(userName)
			.then(user => {
				logger.info('** insertLancamento  PASSO 1 | %j', lancamento.descricao);
				assert.ok(user);
				if (!user.contas)
					return Promise.reject(new BusinessError(`Usuário não possui contas cadastradas! Favor crie uma conta antes cadastrar um lançamento!`));
				else {
					idUsuario = user._id.toString();
					return this.lancamentoDAO.getCompetencia(idUsuario, competenciaAtual);
				}
			})
			.then(compAtual => {
				logger.info('** insertLancamento  PASSO 2 | %j', lancamento.descricao);
				logger.info('** compAtual | %j', compAtual);
				let isCompetenciaAtualExistente = false;
				if (compAtual) {
					isCompetenciaAtualExistente = true;

					logger.info('** compAtual ANTES| %j', compAtual);

					this.corrigirSaldo(compAtual, lancamento, null, false);

					logger.info('** compAtual DEPOIS| %j', compAtual);

					let query: any = { $and: [{ _idUser: idUsuario }, { competencia: compAtual.competencia }] };
					return Promise.all([Promise.resolve(isCompetenciaAtualExistente), this.lancamentoDAO.updateCompetencia(query, { $set: { saldo: compAtual.saldo } })]);
				} else {
					isCompetenciaAtualExistente = false;
					//Obter Ultima Comp anterior
					return Promise.all([Promise.resolve(isCompetenciaAtualExistente), this.lancamentoDAO.obterUltimaCompetenciaAnterior(idUsuario, competenciaAtual)]);
				}
			}).then(([isCompetenciaAtualExistente, compAnterior]) => {
				logger.info('** insertLancamento  PASSO 3 | %j', lancamento.descricao);
				logger.info('** isCompetenciaAtualExistente %j | compAnterior %j', isCompetenciaAtualExistente, compAnterior);
				if (!isCompetenciaAtualExistente) {
					let novaCompetencia: any = {
						competencia: competenciaAtual,
						saldo: 0,
						_idUser: idUsuario
					};
					if (compAnterior) {
						novaCompetencia.saldo = compAnterior.saldo + lancamento.valor
					}
					logger.info('** novaCompetencia %j', novaCompetencia);
					return this.lancamentoDAO.insertCompetencia(novaCompetencia);
				}
				return Promise.resolve();
			})
			.then(resultInsercaoCompetencia => {
				logger.info('** insertLancamento  PASSO 4 | %j', lancamento.descricao);
				if (resultInsercaoCompetencia)
					logger.info('** resultInsercaoCompetencia.result.n %j', resultInsercaoCompetencia.result.n);
				return this.lancamentoDAO.obterCompetenciasPosteriores(idUsuario, competenciaAtual);
			})
			.then(competencias => {
				logger.info('** insertLancamento  PASSO 5 | %j', lancamento.descricao);
				logger.info('** Competencias Posteriores %j', competencias);
				if (competencias) {
					let promises = competencias.map(c => {

						this.corrigirSaldo(c, lancamento, null, false);

						let query: any = { $and: [{ _idUser: idUsuario }, { competencia: c.competencia }] };
						return this.lancamentoDAO.updateCompetencia(query, { $set: { saldo: c.saldo } });
					});

					return Promise.all(promises);
				}
				return Promise.resolve();
			})
			.then(resultadosUpdateCompentecias => {
				logger.info('** insertLancamento  PASSO 6 | %j', lancamento.descricao);
				logger.info('** resultadosUpdateCompentecias %j', resultadosUpdateCompentecias);
				// Transforma o _id para String e Atualizao lancamento com o id do usuario
				lancamento._idUser = idUsuario;
				// Atualiza categoria no lancamento, somente com os dados relevantes
				let categoriaLancamento = { _id: lancamento.categoria._id, nome: lancamento.categoria.nome };
				lancamento.categoria = categoriaLancamento;

				return this.lancamentoDAO.insertLancamento(lancamento)
			})
			.then(resultInsercaoLancamento => {
				logger.info('** insertLancamento  PASSO 7 | %j', lancamento.descricao);
				let insertedLancamento = resultInsercaoLancamento.ops[0];
				assert.equal(resultInsercaoLancamento.result.n, 1);

				return insertedLancamento;
			});
	}

	public insertLancamentoPeriodico(userName: string, lancamento: any) {

		let idParcelamento = randomBytes(16).toString('base64');

		let lancamentosPeriodicos = [];
		let lancamentoBase: any = {
			conta: lancamento.conta,
			categoria: lancamento.categoria,
			data: lancamento.data,
			descricao: lancamento.descricao.concat(` (${lancamento.parcelaAtual} - ${lancamento.qtdParcelas})`),
			valor: lancamento.valor,
			nota: lancamento.nota,
			isDebito: lancamento.isDebito,
			periodicidade: {
				idParcelamento: idParcelamento,
				parcelaInicial: lancamento.parcelaAtual,
				parcelaAtual: lancamento.parcelaAtual,
				qtdParcelas: lancamento.qtdParcelas,
				tipoPeriodo: lancamento.tipoPeriodo,
				valorPeriodo: lancamento.valorPeriodo
			}
		}

		lancamentosPeriodicos.push(lancamentoBase);

		for (let parcelaAtual = lancamento.parcelaAtual + 1, index = 1; parcelaAtual <= lancamento.qtdParcelas; parcelaAtual++ , index++) {

			let novoLancamento: any = {
				conta: lancamentoBase.conta,
				categoria: lancamentoBase.categoria,
				data: this.obterDataLancamentoPeriodico(lancamentoBase, index),
				descricao: lancamento.descricao.concat(` (${parcelaAtual} - ${lancamentoBase.periodicidade.qtdParcelas})`),
				valor: lancamentoBase.valor,
				isDebito: lancamentoBase.isDebito,
				nota: lancamentoBase.nota,
				periodicidade: {
					idParcelamento: idParcelamento,
					parcelaInicial: lancamentoBase.periodicidade.parcelaAtual,
					parcelaAtual: parcelaAtual,
					qtdParcelas: lancamentoBase.periodicidade.qtdParcelas,
					tipoPeriodo: lancamentoBase.periodicidade.tipoPeriodo,
					valorPeriodo: lancamentoBase.periodicidade.valorPeriodo
				}
			}
			lancamentosPeriodicos.push(novoLancamento);
		}

		let arrSequencePromises = [];
		lancamentosPeriodicos.forEach(lancamentoPeriodico => arrSequencePromises.push(this.bindInsertLancamentoIndividual(userName, lancamentoPeriodico)));

		return arrSequencePromises.reduce((chain, task) => chain.then(task), Promise.resolve())
			.then(chainResult => {
				logger.info('** CHAIN RESULT  = %j ', chainResult); // ultimo lancamento inserido
				return lancamentoBase;
			});
	}

	obterDataLancamentoPeriodico(lancamento, incremento) {
		let periodo;

		switch (lancamento.periodicidade.tipoPeriodo) {
			case "mes":
				periodo = 'months'
				break;
			case "dia":
				periodo = 'days'
				break;
			case "semana":
				periodo = 'weeks'
				break;
			case "ano":
				periodo = 'years'
				break;
		}

		return moment(lancamento.data, 'YYYY-MM-DD').add(incremento * lancamento.periodicidade.valorPeriodo, periodo);
	}

	bindInsertLancamentoIndividual(userName, lancamento) {
		return function () {
			return this.insertLancamentoIndividual(userName, lancamento);
		}.bind(this); // bind ou usar arrow function ()=>{}
	}

	public removeLancamentosParcelados(userName: string, idLancamento: any) {

		return this.lancamentoDAO.getLancamentoById(idLancamento)
			.then(lancamento => {
				if (!lancamento)
					return Promise.reject(new BusinessError('Lancamento não encontrado!'))
				else {
					return this.lancamentoDAO.obterLancamentosParceladosFuturos(lancamento);
				}
			})
			.then(lancamentosParcelados => {
				lancamentosParcelados.forEach(l => logger.info("** Remover Lancamentos Parcelados - Lancamentos a ser removido = %j", l.descricao));

				let arrSerialPromises = [];
				lancamentosParcelados.forEach(lancamentosParcelado => arrSerialPromises.push(this.bindRemoveLancamentoIndividual(userName, lancamentosParcelado._id.toHexString())));

				return arrSerialPromises.reduce((chain, task) => chain.then(task), Promise.resolve())
					.then(chainResult => logger.info('** REMOCAO CHAIN RESULT  = %j ', chainResult));
			});
	}

	bindRemoveLancamentoIndividual(userName, idLancamento) {
		return function () {
			return this.removeLancamento(userName, idLancamento);
		}.bind(this); // bind ou usar arrow function ()=>{}
	}

	public removeLancamento(userName: string, idLancamento: any) {

		let lancamentoObtido;
		let competenciaAtual;
		let idUsuario;

		return this.lancamentoDAO.getLancamentoById(idLancamento)
			.then(lancamento => {
				logger.info('** removeLancamento  PASSO 1 | %j', lancamento.descricao);
				if (!lancamento)
					return Promise.reject(new BusinessError('Lancamento não encontrado!'))
				else {
					lancamentoObtido = lancamento;
					competenciaAtual = parseInt(moment(lancamentoObtido.data, 'YYYY-MM-DD').format('YYYYMM'));
					return this.userDAO.getUser(userName);
				}
			})
			.then(user => {
				logger.info('** removeLancamento  PASSO 2 | %j', lancamentoObtido.descricao);
				assert.ok(user);
				idUsuario = user._id.toHexString()
				if (idUsuario != lancamentoObtido._idUser)
					return Promise.reject(new BusinessError(`Lancamento (${lancamentoObtido.nome}) não pertence ao usuário informado!`));
				else
					return this.lancamentoDAO.getCompetencia(idUsuario, competenciaAtual);

			})
			.then(compAtual => {
				logger.info('** removeLancamento  PASSO 3 | %j', lancamentoObtido.descricao);

				this.corrigirSaldo(compAtual, lancamentoObtido, null, true);

				let query: any = { $and: [{ _idUser: idUsuario }, { competencia: compAtual.competencia }] };
				return this.lancamentoDAO.updateCompetencia(query, { $set: { saldo: compAtual.saldo } });
			})
			.then(resultadoUpdateCompentecia => {
				logger.info('** removeLancamento  PASSO 4 | %j', lancamentoObtido.descricao);
				assert.equal(resultadoUpdateCompentecia.result.n, 1)
				return this.lancamentoDAO.obterCompetenciasPosteriores(idUsuario, competenciaAtual);
			})
			.then(competencias => {
				logger.info('** removeLancamento  PASSO 5 | %j', lancamentoObtido.descricao);
				if (competencias) {
					let promises = competencias.map(c => {

						this.corrigirSaldo(c, lancamentoObtido, null, true);

						let query: any = { $and: [{ _idUser: idUsuario }, { competencia: c.competencia }] };
						return this.lancamentoDAO.updateCompetencia(query, { $set: { saldo: c.saldo } });
					});

					return Promise.all(promises);
				}
				return Promise.resolve();
			})
			.then(resultadosUpdateCompentecias => {
				logger.info('** removeLancamento  PASSO 6 | %j', lancamentoObtido.descricao);
				return this.lancamentoDAO.removeLancamentoById(idLancamento);
			})
			.then(resultRemocaoLancamento => {
				logger.info('** removeLancamento  PASSO 7 | %j', lancamentoObtido.descricao);
				assert.equal(resultRemocaoLancamento.result.n, 1)
			});
	}

	public updateLancamento(userName: string, idLancamento: any, lancamento: any) {

		let competenciaAtual = parseInt(moment(lancamento.data, 'YYYY-MM-DD').format('YYYYMM'));
		let idUsuario;
		let lancamentoAnterior;

		return this.userDAO.getUser(userName)
			.then(user => {
				assert.ok(user);
				if (!user.contas)
					return Promise.reject(new BusinessError(`Usuário não possui contas cadastradas! Favor crie uma conta antes cadastrar um lançamento!`));
				else {
					let contaLancamento = user.contas.find(conta => conta === lancamento.conta._id);

					if (!contaLancamento)
						return Promise.reject(new BusinessError(`Lancamento informado não pertence a uma conta do usuário!`));

					idUsuario = user._id.toHexString();

					return this.lancamentoDAO.getLancamentoById(idLancamento)
				}
			})
			.then(lancamentoEncontrado => {
				if (!lancamentoEncontrado)
					return Promise.reject(new BusinessError('Lancamento não encontrado!'))
				else {
					lancamentoAnterior = lancamentoEncontrado;
					competenciaAtual = parseInt(moment(lancamentoAnterior.data, 'YYYY-MM-DD').format('YYYYMM'));
					return this.lancamentoDAO.getCompetencia(idUsuario, competenciaAtual);
				}
			})
			.then(compAtual => {
				this.corrigirSaldo(compAtual, lancamento, lancamentoAnterior, false);
				let query: any = { $and: [{ _idUser: idUsuario }, { competencia: compAtual.competencia }] };
				return this.lancamentoDAO.updateCompetencia(query, { $set: { saldo: compAtual.saldo } });
			})
			.then(resultadoUpdateCompentecia => {
				assert.equal(resultadoUpdateCompentecia.result.n, 1)
				return this.lancamentoDAO.obterCompetenciasPosteriores(idUsuario, competenciaAtual);
			})
			.then(competencias => {
				if (competencias) {
					let promises = competencias.map(c => {
						this.corrigirSaldo(c, lancamento, lancamentoAnterior, false);
						let query: any = { $and: [{ _idUser: idUsuario }, { competencia: c.competencia }] };
						return this.lancamentoDAO.updateCompetencia(query, { $set: { saldo: c.saldo } });
					});

					return Promise.all(promises);
				}
				return Promise.resolve();
			})
			.then(resultadosUpdateCompentecias => {
				let query = { _id: new ObjectID(idLancamento) }

				let lancamentoAtualizado: any = {
					data: moment(lancamento.data, 'YYYY-MM-DD').toDate(),
					descricao: lancamento.descricao,
					valor: lancamento.valor,
					conta: lancamento.conta,
					categoria: { _id: lancamento.categoria._id, nome: lancamento.categoria.nome },
					isDebito: lancamento.isDebito,
					nota: lancamento.nota,
				}

				//TODO: Implementar a possível atualização de periodicidade em lançamentos que não a tinha anteriormente.
				lancamentoAtualizado.periodicidade = undefined;
				logger.info('lancamento.parcelaAtual = %j', lancamento.parcelaAtual);
				if (lancamento.parcelaAtual) {
					lancamentoAtualizado.periodicidade = {
						//idParcelamento: idParcelamento,
						parcelaInicial: lancamento.parcelaAtual,
						parcelaAtual: lancamento.parcelaAtual,
						qtdParcelas: lancamento.qtdParcelas,
						tipoPeriodo: lancamento.tipoPeriodo,
						valorPeriodo: lancamento.valorPeriodo
					}
				}
				logger.info('lancamentoAtualizado = %j', lancamentoAtualizado);

				return this.lancamentoDAO.updateLancamento(query, { $set: lancamentoAtualizado });
			})
			.then((resultLancamentoUpdated) => {
				assert.equal(resultLancamentoUpdated.result.n, 1);
				return this.lancamentoDAO.getLancamentoByDescricao(lancamento.descricao);
			});
	}


	public updateLancamentosParcelados(userName: string, idLancamento: any, lancamento: any) {

		return this.lancamentoDAO.getLancamentoById(idLancamento)
			.then(lancamentoAnterior => {
				if (!lancamentoAnterior)
					return Promise.reject(new BusinessError('Lancamento não encontrado!'))
				else {
					if (lancamentoAnterior.periodicidade) {
						if (lancamento.parcelaAtual) {
							return this.removeLancamentosParcelados(userName, idLancamento)
								.then(result => {
									return this.insertLancamentoPeriodico(userName, lancamento);
								});
						} else {
							return this.removeLancamentosParcelados(userName, idLancamento)
								.then(result => {
									return this.insertLancamento(userName, lancamento);
								});
						}
					} else {
						return this.removeLancamento(userName, idLancamento)
							.then(result => {
								return this.insertLancamentoPeriodico(userName, lancamento);
							});
					}
				}
			});
	}

	bindUpdateLancamentoIndividual(userName, idLancamento, lancamento) {
		return function () {
			return this.updateLancamento(userName, idLancamento, lancamento);
		}.bind(this); // bind ou usar arrow function ()=>{}
	}

	public corrigirSaldo(competencia, lancamentoAtual, lancamentoAnterior, isRemocao) {
		// usado no Update
		if (lancamentoAnterior) {
			if (lancamentoAnterior.isDebito) {
				competencia.saldo += lancamentoAnterior.valor;
			} else {
				competencia.saldo -= lancamentoAnterior.valor;
			}
		}

		if (!isRemocao) {
			if (lancamentoAtual.isDebito) {
				competencia.saldo -= lancamentoAtual.valor;
			} else {
				competencia.saldo += lancamentoAtual.valor;
			}
		} else {
			if (lancamentoAtual.isDebito) {
				competencia.saldo += lancamentoAtual.valor;
			} else {
				competencia.saldo -= lancamentoAtual.valor;
			}
		}
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
