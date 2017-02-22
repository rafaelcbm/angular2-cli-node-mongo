import { Conta } from "./conta.model";

export class Lancamento {

	constructor(
		public _id?: string,
		public descricao?: string,
		public valor?: number,
		public conta?: Conta,
		public data?: Date|string,
		public isDebito?: boolean,
		public notas?: string) { }
}
