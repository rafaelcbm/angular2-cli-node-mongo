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
	_idCategoria:1,
	conta: {
			_id:1,
			nome: "Conta"
			},
	descricao:"",
	data:Date,
	valor:123,45 , //Decimal
	isDebito: true,	
	notas: "Text of Note"
}
```

## *CATEGORIA*
```
categoria {
	_id:123,
	_idUser:1,
	nome: "Despesa",
	ancestrais:["Cat 1", "Cat 2", "Cat 3"]
	pai:"Cat Pai"
}
```
