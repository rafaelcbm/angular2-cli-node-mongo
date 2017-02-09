export class Lancamento {

	constructor(public _id: number, public nome: string, public valor: number, public idConta: string, public data: Date, public isCredit: boolean) { }
}
