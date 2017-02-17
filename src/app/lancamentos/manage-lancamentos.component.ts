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

		console.log("onSelectLancamento: ", lancamento);
		this.lancamento = lancamento;
	}
}
