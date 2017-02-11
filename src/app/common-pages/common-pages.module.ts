import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CommonPagesRoutingModule } from './common-pages.routing';
//import { ContasModule } from './contas/contas.module';

import { HomeComponent } from './home.component';
import { MainComponent } from './main.component';

/**** Inicio imports componentes do template ****/
import { DropdownModule } from 'ng2-bootstrap/dropdown';
import { TabsModule } from 'ng2-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { NAV_DROPDOWN_DIRECTIVES } from '../shared/nav-dropdown.directive';
import { SIDEBAR_TOGGLE_DIRECTIVES } from '../shared/sidebar.directive';
import { AsideToggleDirective } from '../shared/aside.directive';
import { BreadcrumbsComponent } from '../shared/breadcrumb.component';

@NgModule({
    declarations: [
        HomeComponent, MainComponent,

        /* Imports do template */
        NAV_DROPDOWN_DIRECTIVES,
        BreadcrumbsComponent,
        SIDEBAR_TOGGLE_DIRECTIVES,
        AsideToggleDirective,
    ],
    imports: [
        CommonModule,
        FormsModule,
        CommonPagesRoutingModule,

        /* Imports do template */
        DropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule
    ],
    providers: []
})
export class CommonPagesModule { }
