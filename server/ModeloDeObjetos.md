# - Modelo de Objetos
---
## *USER*
```
user {
	_id:1,
	userName: "", //TODO: mudar para userName futuramente
	password:"",
	contas:[1,2,3] //Conta Ids	
}
```
## *CONTA*
```
conta{
	_id:1,
	nome: ""
}
```
## *LANCAMENTO*
```
lancamento{
	_id:123,
	_idUser:1,
	conta: {
			_id:1,
			nome: "Conta"
			},
	descricao:"",
	data:Date,
	valor:123,45 , //Decimal
	isDebito: true,	
	notas: "Text of Note",		
	categoria: {
			_id:1,
			nome: "cat"
			}
}
```