import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { TabsModule }               from 'ng2-bootstrap/tabs';

import { LancamentosRoutingModule } from './lancamentos.routing';
import { ManageLancamentosComponent } from './manage-lancamentos.component';
import { LancamentosListComponent } from './lancamentos-list.component';
import { LancamentosDetailComponent } from './lancamentos-detail.component';
import { LancamentosService } from '../services/lancamentos.service';
import { ContasService } from '../services/contas.service';
import { NotificacaoService } from '../services/notificacao.service';

@NgModule({
    declarations: [
        ManageLancamentosComponent,
        LancamentosListComponent,
        LancamentosDetailComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        LancamentosRoutingModule,
        TabsModule.forRoot()
    ],
    providers: [
        LancamentosService,
        ContasService,
        NotificacaoService
    ]
})
export class LancamentosModule {}
