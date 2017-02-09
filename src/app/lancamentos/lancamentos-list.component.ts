import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { LancamentosService } from '../services/lancamentos-service';
import { Conta } from "../models/models.module";


@Component({
	selector: 'lancamentos-list',
	templateUrl: './lancamentos-list.component.html'
})
export class LancamentosListComponent implements OnInit {

	constructor(private lancamentosService: LancamentosService, private route: ActivatedRoute, private router: Router) { }

	ngOnInit() { }
}
