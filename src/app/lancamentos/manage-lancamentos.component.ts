import { Component, OnInit } from '@angular/core';

import { FiltroLancamentoService } from './filtro-lancamento.service';

@Component({
	templateUrl: './manage-lancamentos.component.html',
	styleUrls: ['./manage-lancamentos.component.scss']
})
export class ManageLancamentosComponent implements OnInit {

	novoLancamento: any;
	showCategorias = true;
	showContas = true;

	ngOnInit() {
		this.filtroLancamentoService.selectedLancamento$.subscribe(
			lancamento => this.novoLancamento = lancamento);
	}

	constructor(private filtroLancamentoService: FiltroLancamentoService) { }

	onShowCategoriaChange(showCategorias: boolean) {
		this.showCategorias = showCategorias;
	}

	onShowContaChange(showContas: boolean) {
		this.showContas = showContas;
	}

	onLancamentoDetailVoltar(isVoltou) {
		if (isVoltou) {
			this.novoLancamento = undefined;
		}
	}
}
