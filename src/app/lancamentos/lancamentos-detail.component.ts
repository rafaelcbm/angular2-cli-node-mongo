import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/map';

import { NotificationsService } from "angular2-notifications";



import { Conta } from "../models/models.module";
import { LancamentosService } from '../services/lancamentos-service';


@Component({
    selector: 'lancamentos-detail',
    templateUrl: './lancamentos-detail.component.html'
})
export class LancamentosDetailComponent implements OnInit {


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private lancamentosService: LancamentosService,
        private _notificationsService: NotificationsService
    ) { }

    ngOnInit() { }
}
