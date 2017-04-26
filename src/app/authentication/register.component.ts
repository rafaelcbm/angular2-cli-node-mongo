import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from "@angular/http";

import "rxjs/add/operator/map";
import { Observable } from 'rxjs/Observable';

import { CategoriasService } from './../services/categorias.service';
import { AuthService } from './auth.service';


@Component({
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

    registerObservable$: Observable<any>;

    constructor(private authService: AuthService, private router: Router, private http: Http, private categoriasService: CategoriasService) { }

    ngOnInit() {
        // subscribe to the observable
        this.registerObservable$ = this.authService.registerObservable$;
        this.registerObservable$.subscribe((data) => this.signupHandler(data));
    }

    signup(formValue) {
        this.authService.signup(formValue);
    }

    signupHandler(data) {

        console.log("DADOS DO NOVO USER =", data);

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
