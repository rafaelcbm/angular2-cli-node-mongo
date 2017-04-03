import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class FiltroLancamentoService {

	private competenciaLancamentoSource = new Subject<string>();
	competenciaLancamento$ = this.competenciaLancamentoSource.asObservable();

	novaCompetencia(novaCompetencia: string) {
		this.competenciaLancamentoSource.next(novaCompetencia);
	}
}
