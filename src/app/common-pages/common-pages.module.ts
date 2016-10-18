import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CommonPagesRoutingModule } from './common-pages.routing';

import { HomeComponent } from './home.component';
import { MainComponent } from './main.component';

/**** Inicio imports componentes do template ****/

import { Ng2BootstrapModule } from 'ng2-bootstrap/ng2-bootstrap';
// import { ChartsModule } from 'ng2-charts/ng2-charts';
import { NAV_DROPDOWN_DIRECTIVES } from '../template/shared/nav-dropdown.directive';
import { SIDEBAR_TOGGLE_DIRECTIVES } from '../template/shared/sidebar.directive';
import { AsideToggleDirective } from '../template/shared/aside.directive';
import { BreadcrumbsComponent } from '../template/shared/breadcrumb.component';


@NgModule({
    declarations: [
        HomeComponent, MainComponent,

        /* Imports do template */
        NAV_DROPDOWN_DIRECTIVES,
        BreadcrumbsComponent,
        SIDEBAR_TOGGLE_DIRECTIVES,
        AsideToggleDirective
    ],
    imports: [
        BrowserModule,
        FormsModule,
        CommonPagesRoutingModule,
         /* Imports do template */
        Ng2BootstrapModule,
        // ChartsModule
    ],
    providers: []
})
export class CommonPagesModule { }
