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
	showCategorias = true;

	onSelectLancamento(lancamento: Lancamento) {
		this.lancamento = lancamento;
	}

	onAdicionar(lancamento: Lancamento) {
		this.lancamento = new Lancamento();
	}

	onShowCategoriaChange(showCategorias: boolean) {
		Log.info('onShowCategoriaChange:', showCategorias);
		this.showCategorias = showCategorias;
	}
}
