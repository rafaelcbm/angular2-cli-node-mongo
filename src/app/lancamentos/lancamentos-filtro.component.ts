import { Log } from './../util/log';
import { Component, EventEmitter, Output } from '@angular/core';

import * as moment from 'moment';

import { Lancamento } from "../models/models.module";


@Component({
	selector: 'lancamentos-filtro',
	templateUrl: './lancamentos-filtro.component.html'
})
export class LancamentosFiltroComponent {

	@Output() onAdicionar = new EventEmitter<Lancamento>();

	showDatePicker = false;
	mesCompetencia: any = new Date().toISOString();

	adicionar() {
		this.onAdicionar.emit(new Lancamento());
	}

	previousMonth() {
		Log.debug('Mes=', this.mesCompetencia);
		this.mesCompetencia = moment(this.mesCompetencia, 'YYYY-MM-DD').subtract(1, 'months').toISOString();
	}

	nextMonth() {
		Log.debug('Mes=', this.mesCompetencia);
		this.mesCompetencia = moment(this.mesCompetencia, 'YYYY-MM-DD').add(1, 'months').toISOString();
	}

}
