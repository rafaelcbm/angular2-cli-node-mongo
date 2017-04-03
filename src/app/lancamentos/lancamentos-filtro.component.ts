import { Log } from './../util/log';
import { Component, EventEmitter, Output } from '@angular/core';

import * as moment from 'moment';

import { Lancamento } from "../models/models.module";
import { FiltroLancamentoService } from './filtro-lancamento.service';


@Component({
	selector: 'lancamentos-filtro',
	templateUrl: './lancamentos-filtro.component.html'
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
		Log.debug('Mes=', this.mesCompetencia);
		this.mesCompetencia = moment(this.mesCompetencia, 'YYYY-MM-DD').subtract(1, 'months').toISOString();

		this.filtroLancamentoService.novaCompetencia(this.mesCompetencia);
	}

	nextMonth() {
		Log.debug('Mes=', this.mesCompetencia);
		this.mesCompetencia = moment(this.mesCompetencia, 'YYYY-MM-DD').add(1, 'months').toISOString();

		this.filtroLancamentoService.novaCompetencia(this.mesCompetencia);
	}

	onCompetenciaChanged(competencia: string) {
		Log.log('onCompetenciaChanged = ', competencia);

		let pattern = new RegExp(/\d\d\/\d\d\d\d/);
		if (pattern.test(competencia)) {
			this.filtroLancamentoService.novaCompetencia(competencia);
		}
	}

	onSelectionDone(dataCalendario: Date) {

		this.showDatePicker = false;

		Log.info('Data selecionada: ', moment(dataCalendario).toISOString());
	}
}
