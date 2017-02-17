import { Conta } from "./conta.model";

export class User {

	constructor(
		public _id?: string,
		public userName?: string,
		public contas?: [Conta]) { }
}
