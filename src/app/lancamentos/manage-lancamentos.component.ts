import { Log } from './../util/log';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Lancamento } from "../models/models.module";

@Component({
	templateUrl: './manage-lancamentos.component.html'
})
export class ManageLancamentosComponent {
	constructor() { }

	lancamento: Lancamento;

	onSelectLancamento(lancamento: Lancamento) {
		this.lancamento = lancamento;
	}

	onAdicionar(lancamento: Lancamento) {
		Log.info('Chamou on Adicionar');
		this.lancamento = new Lancamento();
	}
}
