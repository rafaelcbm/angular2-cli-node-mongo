import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { NotificationsService } from "angular2-notifications";
import { Observable } from 'rxjs/Observable';

import { Log } from './../util/log';
import { NotificacaoService } from '../services/notificacao.service';
import { ContasService } from '../services/contas.service';
import { Conta } from "../models/models.module";

@Component({
	selector: 'contas-list',
	templateUrl: './contas-list.component.html'
})
export class ContasListComponent implements OnInit {

	contas$: Observable<Conta[]>;
	public selectedId: string;

	constructor(private contasService: ContasService, private route: ActivatedRoute, private router: Router,
     private notificacaoService: NotificacaoService, private _notificationsService: NotificationsService ) { }

	ngOnInit() {
		this.contas$ = this.contasService.dataObservable$;		

		this.contasService.retrieve();

		this.notificacaoService.errorMsg$.subscribe(
			errorMsg => this.showErrorMessage(errorMsg),
			error => Log.error(error)
		);

		this.notificacaoService.successMsg$.subscribe(
			successMsg => this.showSuccessMessage(successMsg),
			error => Log.error(error));
	}

	onSelect(conta: Conta) {
		this.selectedId = conta._id;

		// Navigate with relative link
		this.router.navigate([conta._id], { relativeTo: this.route });
	}

	novaConta() {
		this.router.navigate(['new'], { relativeTo: this.route });
	}

	showSuccessMessage(message: string) {
        //Sobrescreve as opções padrão, definidas no compoenente pai.
        this._notificationsService.success(
            'Sucesso',
            message
        )
    }

	showErrorMessage(message: string) {
        //Sobrescreve as opções padrão, definidas no compoenente pai.
        this._notificationsService.error(
            'Erro',
            message
        )
    }
}
