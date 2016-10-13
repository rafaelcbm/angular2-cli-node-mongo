import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { RegisterComponent } from './register.component';
import { LoginComponent } from './login.component';
import { MainComponent } from './main.component';
import { routing } from './app.routing';

import { provideAuth } from "angular2-jwt";


/**** Inicio imports componentes do template ****/

import { Ng2BootstrapModule } from 'ng2-bootstrap/ng2-bootstrap';
// import { ChartsModule } from 'ng2-charts/ng2-charts';

import { NAV_DROPDOWN_DIRECTIVES } from './template/shared/nav-dropdown.directive';

import { SIDEBAR_TOGGLE_DIRECTIVES } from './template/shared/sidebar.directive';
import { AsideToggleDirective } from './template/shared/aside.directive';
import { BreadcrumbsComponent } from './template/shared/breadcrumb.component';

//Layouts
// import { FullLayoutComponent } from './template/layouts/full-layout.component';
// import { SimpleLayoutComponent } from './template/layouts/simple-layout.component';

// //Main view
// import { DashboardComponent } from './template/dashboard/dashboard.component';

// //Components
// import { ButtonsComponent } from './template/components/buttons.component';
// import { CardsComponent } from './template/components/cards.component';
// import { FormsComponent } from './template/components/forms.component';
// import { SocialButtonsComponent } from './template/components/social-buttons.component';
// import { SwitchesComponent } from './template/components/switches.component';
// import { TablesComponent } from './template/components/tables.component';

// //Icons
// import { FontAwesomeComponent } from './template/icons/font-awesome.component';
// import { SimpleLineIconsComponent } from './template/icons/simple-line-icons.component';

// //Widgets
// import { WidgetsComponent } from './template/widgets/widgets.component';

// //Charts
// import { ChartsComponent } from './template/charts/charts.component';

// //Pages
// import { p404Component } from './template/pages/404.component';
// import { p500Component } from './template/pages/500.component';

/**** FIM imports componentes do template ****/

@NgModule({
    declarations: [
        AppComponent, HomeComponent, RegisterComponent, LoginComponent, MainComponent,

        // FullLayoutComponent,
        // SimpleLayoutComponent,
        // DashboardComponent,
        // ButtonsComponent,
        // CardsComponent,
        // FormsComponent,
        // SocialButtonsComponent,
        // SwitchesComponent,
        // TablesComponent,
        // FontAwesomeComponent,
        // SimpleLineIconsComponent,
        // WidgetsComponent,
        // ChartsComponent,
        // p404Component,
        // p500Component,
        NAV_DROPDOWN_DIRECTIVES,
        BreadcrumbsComponent,
        SIDEBAR_TOGGLE_DIRECTIVES,
        AsideToggleDirective
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,

        /* Imports do template */
        Ng2BootstrapModule,
        // ChartsModule
    ],
    providers: [
        provideAuth({
            globalHeaders: [{ "Content-type": "application/json" }],
            newJwtError: true,
            noTokenScheme: true
        })
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
