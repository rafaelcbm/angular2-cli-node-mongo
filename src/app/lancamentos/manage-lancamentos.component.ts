import { Log } from './../util/log';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Lancamento } from "../models/models.module";

@Component({
	templateUrl: './manage-lancamentos.component.html'
})
export class ManageLancamentosComponent {
	constructor() { }

	showCategorias = true;

	onShowCategoriaChange(showCategorias: boolean) {
		this.showCategorias = showCategorias;
	}
}
