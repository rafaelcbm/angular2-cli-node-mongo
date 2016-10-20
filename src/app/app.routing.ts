import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forRoot([{
            path: '',
            redirectTo: 'home',
            pathMatch: 'full'
        },
        {
            path: '**',
            redirectTo: 'home'
        }
            
            // {
            //     //TODO: testar criar um módulo específico para o MainComponent que importará os "feature modules",
            //     //que  serão criados com RouterModule.forChild no routing module. Dessa forma, deverá ser possível
            //     // aninhar as rotas das features modularizdas. Nesse caso, ficará somente essa rota
            //     // {path: 'main', component: MainComponent} sem os filhos aqui.
            //     path: 'main',
            //     component: MainComponent,
            //     //canActivate: [AuthGuard],
            //     children: [
            //         {
            //             path: '',
            //             //canActivateChild: [AuthGuard],
            //             children: [
            //                 { path: 'contas', component: ManageContasComponent },
            //                 { path: '', component: DashboardComponent },
            //                 // { path: 'lancamentos', component: ManageLancamentosComponent },
            //                 // { path: '', component: DashboardComponent }
            //             ]
            //         }
            //     ]
            // }

        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }