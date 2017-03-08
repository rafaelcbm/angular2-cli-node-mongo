import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { NotificationsService } from "angular2-notifications";
import { Observable } from 'rxjs/Observable';

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

	public options = {
		position: ["bottom", "right"],
		timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: true,
		lastOnBottom: true
	};

	constructor(private contasService: ContasService, private route: ActivatedRoute, private router: Router,
     private notificacaoService: NotificacaoService, private _notificationsService: NotificationsService ) { }

	ngOnInit() {
		this.contas$ = this.contasService.contas; // subscribe to entire collection

		this.contasService.getAllContas();    // load all contas
		//this.erros$ = this.contasService.erros$;

		this.notificacaoService.errorMsg$.subscribe(
			errorMsg => this.showErrorMessage(errorMsg),
			error => console.log(error)
		);

		this.notificacaoService.successMsg$.subscribe(
			successMsg => this.showSuccessMessage(successMsg),
			error => console.log(error));
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
