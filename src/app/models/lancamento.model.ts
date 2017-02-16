import { Conta } from "./conta.model";

export class Lancamento {

	constructor(
		public _id?: number,
		public descricao?: string,
		public valor?: number,
		public conta?: Conta,
		public data?: Date,
		public isDebito?: boolean,
		public notas?: string) { }
}
