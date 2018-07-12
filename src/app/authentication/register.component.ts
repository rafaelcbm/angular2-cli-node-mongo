import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import "rxjs/add/operator/map";
import { Observable } from 'rxjs';

import { CategoriasService } from './../services/categorias.service';
import { AuthService } from './auth.service';


@Component({
	templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

	registerObservable$: Observable<any>;

	constructor(private authService: AuthService, private router: Router, private categoriasService: CategoriasService, private route: ActivatedRoute) { }

	ngOnInit() {
		// subscribe to the observable
		this.registerObservable$ = this.authService.registerObservable$;
		this.registerObservable$.subscribe((data) => this.signupHandler(data));

		//TODO: REMOVER DAQUI E CRIAR UM NOVO COMPONENTE COM LOADING PARA ISSO
		//TESTE DE LOGIN COM SPOTIFY
		this.route.queryParams.subscribe(params => {
			if (params.token) {
				this.authService.adicionarTokenSpotifyUser(params.token);
				this.router.navigate(['main/contas']);
			}
			if ('newUser' in params) {
				this.criarCategoriasPadrao();
			}
		})
	}

	signup(formValue) {
		this.authService.signup(formValue);
	}

	signupHandler(data) {

		if (data.status === "erro") {
			console.log("Mensagem de erro =", data.message);
			return;
		}

		if (this.authService.isLoggedIn()) {

			this.criarCategoriasPadrao();

			// Get the redirect URL from our auth service
			// If no redirect has been set, use the default
			let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : 'main/contas';
			// Redirect the user
			this.router.navigate([redirect]);
		}
	}

	criarCategoriasPadrao() {
		this.categoriasService.create({ novaCategoria: { nome: "Sem Categoria", ancestrais: null, pai: null } });
		this.categoriasService.create({ novaCategoria: { nome: "Todas", ancestrais: null, pai: null } });
	}
}
