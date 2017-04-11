import { ObjectID } from "mongodb";
import { Service, Inject } from 'typedi';
import * as logger from 'logops';
import { Container } from 'typedi';
import * as co from "co";

import { UserDAO } from './../dal/userDAO';
import { CategoriaDAO } from './../dal/categoriaDAO';

@Service()
export class CategoriaService {

	categoriaDAO: CategoriaDAO = Container.get(CategoriaDAO);

	//TODO
	public getArvoreCategoriasByUser(userId: string): any {

		let categorias: any = [
			{
				_id: 0,
				nome: 'Sem Categoria'
			},
			{
				_id: 1,
				nome: 'Despesas',
				isExpanded: true,
				children: [
					{ _id: '58ed3bb27343cc201c726af4', nome: 'Alimentação' },
					{ _id: 3, nome: 'Lazer' },
					{ _id: 4, nome: 'Transporte' }
				]
			},
			{
				_id: 5,
				nome: 'Receitas',
				children: [
					{ _id: 6, nome: 'Salário' },
					{
						_id: 7, nome: 'Ticket',
						children: [
							{ _id: 8, nome: 'Alimentação' },
							{ _id: 9, nome: 'Refeição' }
						]
					}
				]
			}
		];

		return categorias;
	}
}
