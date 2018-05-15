import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class FiltroLancamentoService {

	private contas: string[] = [];
	private categorias: string[] = [];

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

	onSelectedContas(contas: any) {
		this.contas = contas;
		this.selectedContasSource.next(this.contas);
	}

	onDeselectCategoria(categoria: string) {

		let clearSelection = false;

		if (!this.categorias.find(cat => cat == categoria)) {
			this.categorias = [];
			this.selectedCategoriasSource.next(this.categorias)
			clearSelection = true;
		} else {
			this.categorias = this.categorias.filter(cat => cat != categoria);
		}

		this.selectedCategoriasSource.next(this.categorias);
		return clearSelection;
	}

	onSelectCategoria(categoria: string) {
		this.categorias.push(categoria);
		this.selectedCategoriasSource.next(this.categorias);
	}

	obterCategoriasSeleciondas() {
		return Object.assign([], this.categorias);
	}

	obterContasSeleciondas() {
		return Object.assign([], this.contas);
	}
}
