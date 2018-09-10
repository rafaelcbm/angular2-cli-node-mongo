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
		])
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule { }
