import { Component, EventEmitter, Output } from '@angular/core';

import * as moment from 'moment';

import { Lancamento } from "../models/models.module";
import { FiltroLancamentoService } from './filtro-lancamento.service';


@Component({
	selector: 'lancamentos-filtro',
	templateUrl: './lancamentos-filtro.component.html',
	styleUrls: ['./lancamentos-filtro.component.scss']
})
export class LancamentosFiltroComponent {

	@Output() onAdicionar = new EventEmitter<Lancamento>();

	showDatePicker = false;
	mesCompetencia: any = new Date().toISOString();

	constructor(private filtroLancamentoService: FiltroLancamentoService) { }

	adicionar() {
		this.onAdicionar.emit(new Lancamento());
	}

	previousMonth() {
		this.mesCompetencia = moment(this.mesCompetencia, 'YYYY-MM-DD').subtract(1, 'months').toDate();

		this.notificaNovaCompetencia();
	}

	nextMonth() {
		this.mesCompetencia = moment(this.mesCompetencia, 'YYYY-MM-DD').add(1, 'months').toDate();

		this.notificaNovaCompetencia();
	}

	onCompetenciaChanged(competencia: string) {
		let pattern = new RegExp(/\d\d\/\d\d\d\d/);

		if (pattern.test(competencia)) {
			this.mesCompetencia = moment(competencia, 'MM/YYYY').toDate();

			this.notificaNovaCompetencia();
		}
	}

	onSelectionDone(dataCalendario: Date) {
		this.showDatePicker = false;
		this.mesCompetencia = moment(dataCalendario, 'YYYY-MM-DD').toDate();

		this.notificaNovaCompetencia();
	}

	notificaNovaCompetencia() {
		this.filtroLancamentoService.novaCompetencia(moment(this.mesCompetencia, 'YYYY-MM-DD').toISOString());
	}
}
