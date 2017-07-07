import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class FiltroLancamentoService {

	private competenciaLancamentoSource = new Subject<string>();
	competenciaLancamento$ = this.competenciaLancamentoSource.asObservable();

	private selectedLancamentoSource = new Subject<any>();
	selectedLancamento$ = this.selectedLancamentoSource.asObservable();

	private selectedContasSource = new Subject<any>();
	selectedContas$ = this.selectedContasSource.asObservable();

	private selectedCategoriasSource = new Subject<any>();
	selectedCategorias$ = this.selectedCategoriasSource.asObservable();

	novaCompetencia(novaCompetencia: string) {
		this.competenciaLancamentoSource.next(novaCompetencia);
	}

	selectLancamento(lancamento: any) {
		this.selectedLancamentoSource.next(lancamento);
	}

	onSelectedContas(contas:any){
		this.selectedContasSource.next(contas);
	}

	onSelectedCategorias(categorias:any){
		this.selectedCategoriasSource.next(categorias);
	}
}
