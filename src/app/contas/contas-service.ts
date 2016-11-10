export class Conta {
    constructor(public id: number, public name: string) {}
}


const CONTAS = [
    new Conta(1, 'Conta Conjunta'),
    new Conta(2, 'Cartão - Itaú'),
    new Conta(3, 'Cartão - Santander'),
];

let contasPromise = Promise.resolve(CONTAS);


import { Injectable } from '@angular/core';

@Injectable()
export class ContasService {

    getContas() {
        return contasPromise;
    }

    getContasById(id: number | string) {
        return contasPromise
            .then(contas => contas.find(conta => conta.id === +id));
    }
}
