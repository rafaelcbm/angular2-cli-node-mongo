import { Component, EventEmitter, Output } from '@angular/core';

import { Lancamento } from "../models/models.module";


@Component({
	selector: 'lancamentos-filtro',
	templateUrl: './lancamentos-filtro.component.html'
})
export class LancamentosFiltroComponent {

	@Output() onAdicionar = new EventEmitter<Lancamento>();

	adicionar() {
		this.onAdicionar.emit(new Lancamento());
	}
}
