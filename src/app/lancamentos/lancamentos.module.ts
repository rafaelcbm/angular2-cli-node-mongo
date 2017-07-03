import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { TreeModule } from 'angular-tree-component';

import { SharedDirectivesModule } from './../directives/shared-directives.module';
import { SharedPipesModule } from './../pipes/shared-pipes.module';
import { LancamentosRoutingModule } from './lancamentos.routing';
import { ManageLancamentosComponent } from './manage-lancamentos.component';
import { LancamentosListComponent } from './lancamentos-list.component';
import { LancamentosDetailComponent } from './lancamentos-detail.component';
import { LancamentosFiltroComponent } from './lancamentos-filtro.component';
import { LancamentosService } from '../services/lancamentos.service';
import { ContasService } from '../services/contas.service';
import { FiltroLancamentoService } from './filtro-lancamento.service';
import { CategoriasService } from './../services/categorias.service';
import { CategoriasTreeComponent } from '../categorias/categorias-tree.component';
import { ContasTreeComponent } from "../contas/contas-tree.component";

@NgModule({
    declarations: [
        ManageLancamentosComponent,
        LancamentosListComponent,
        LancamentosDetailComponent,
		LancamentosFiltroComponent,
		CategoriasTreeComponent,
		ContasTreeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        LancamentosRoutingModule,
		SharedPipesModule,
		SharedDirectivesModule,
        TabsModule.forRoot(),
        DatepickerModule.forRoot(),
		TreeModule
    ],
    providers: [
        LancamentosService,
        ContasService,
		FiltroLancamentoService,
		CategoriasService
    ]
})
export class LancamentosModule {}
