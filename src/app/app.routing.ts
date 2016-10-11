import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { RegisterComponent } from './register.component';
import { LoginComponent } from './login.component';
import { MainComponent } from './main.component';

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
        path: 'main',
        component: MainComponent
    }

];

export const routing = RouterModule.forRoot(appRoutes);
