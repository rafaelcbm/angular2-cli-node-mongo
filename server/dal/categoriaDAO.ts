import { ObjectID } from "mongodb";
import { Service, Inject } from 'typedi';
import * as logger from 'logops';

import { DataAccess } from "./abstractDAO";

@Service()
export class CategoriaDAO {

	@Inject() private _dataAccess: DataAccess;
	CATEGORIA_COLLECTION = 'categorias';

	public getCategoriaByIds(idsCategorias: any): any {

		//Converte os ids de String->ObjectID, para uso como parâmetro da consulta.
		let idsCategoriasAsObjectID = [];
		idsCategorias.forEach(id => idsCategoriasAsObjectID.push(ObjectID.createFromHexString(id)));

		return this._dataAccess.getDocuments(this.CATEGORIA_COLLECTION, { _id: { $in: idsCategoriasAsObjectID } });
	}

	public getCategoriaById(idCategoria: string): any {

		return this._dataAccess.getDocumentById(this.CATEGORIA_COLLECTION, idCategoria);
	}

	public getCategoriasByUser(idUser: string): any {
		return this._dataAccess.getDocuments(this.CATEGORIA_COLLECTION, { _idUser: idUser });
	}

	public getCategoriaPai(idUser: string): any {
		return this._dataAccess.getDocuments(this.CATEGORIA_COLLECTION, { _idUser: idUser });
	}

	public getCategoriasRaiz(idUser: string): any {
		return this._dataAccess.getDocuments(this.CATEGORIA_COLLECTION, { _idUser: idUser, pai: null });
	}

	public getCategoriasFilhas(idUser: string, pai: string): any {
		return this._dataAccess.getDocuments(this.CATEGORIA_COLLECTION, { _idUser: idUser, pai: pai });
	}

	public getCategoriaByNome(nome: string): any {
		return this._dataAccess.getDocument(this.CATEGORIA_COLLECTION, { nome });
	}

	public insertCategoria(categoria: any): any {
		return this._dataAccess.insertDocument(categoria, this.CATEGORIA_COLLECTION);
	}

	public removeCategoriaById(idCategoria: string): any {
		return this._dataAccess.removeDocumentById(this.CATEGORIA_COLLECTION, idCategoria);
	}

	public removeCategoriasFilhas(nome: string): any {
		return this._dataAccess.removeDocuments(this.CATEGORIA_COLLECTION, { ancestrais: nome });
	}

	public updateCategoria(query: any, updateObj: any, options: any = { multi: true }): any {

		return this._dataAccess.dbConnection.collection(this.CATEGORIA_COLLECTION).update(query, updateObj, options);
	}
}
