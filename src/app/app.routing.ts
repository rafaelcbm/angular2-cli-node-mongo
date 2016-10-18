import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './common-pages/home.component';
import { RegisterComponent } from './common-pages/register.component';
import { LoginComponent } from './common-pages/login.component';
import { MainComponent } from './common-pages/main.component';
import { ManageContasComponent } from './contas/manage-contas.component';
import { DashboardComponent } from './contas/dashboard.component';


const appRoutes: Routes = [{
       path: '',
       redirectTo: 'home',
       pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        //TODO: testar criar um módulo específico para o MainComponent que importará os "feature modules",
        //que  serão criados com RouterModule.forChild no routing module. Dessa forma, deverá ser possível
        // aninhar as rotas das features modularizdas. Nesse caso, ficará somente essa rota
        // {path: 'main', component: MainComponent} sem os filhos aqui.
        path: 'main',
        component: MainComponent,
        //canActivate: [AuthGuard],
        children: [
             {
                path: '',
                //canActivateChild: [AuthGuard],
                children: [
                    { path: 'contas', component: ManageContasComponent },
                    { path: '', component: DashboardComponent },
                   // { path: 'lancamentos', component: ManageLancamentosComponent },
                   // { path: '', component: DashboardComponent }
                ]
             }
        ]
    }

];

export const routing = RouterModule.forRoot(appRoutes);
