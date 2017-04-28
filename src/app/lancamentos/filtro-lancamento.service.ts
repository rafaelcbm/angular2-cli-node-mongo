import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class FiltroLancamentoService {

	private competenciaLancamentoSource = new Subject<string>();
	competenciaLancamento$ = this.competenciaLancamentoSource.asObservable();

	private selectedLancamentoSource = new Subject<any>();
	selectedLancamento$ = this.selectedLancamentoSource.asObservable();

	novaCompetencia(novaCompetencia: string) {
		this.competenciaLancamentoSource.next(novaCompetencia);
	}

	selectLancamento(lancamento: any) {
		console.debug('selectLancamento lancamento=', lancamento);
		this.selectedLancamentoSource.next(lancamento);
	}
}
