import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageLancamentosComponent } from './manage-lancamentos.component';

@NgModule({
	imports: [
		RouterModule.forChild([{
			path: '',
			component: ManageLancamentosComponent
		}])
	],
	exports: [
		RouterModule
	]
})
export class LancamentosRoutingModule { }
