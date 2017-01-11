# Alt-Modelo de Objetos
---
## *USER*
```
user {
	id:1,
	name: "", //TODO: mudar para userName futuramente
	password:"",
	contas:[1,2,3] //Conta Ids	
}
```
## *CONTA*
```
conta{
	id:1,
	name: ""
}
```
## *LANCAMENTO*
```
lancamento{
	id:1,
	idConta: 1,
	name:"",
	date:Date,
	valor:123,45 , //Decimal
	isCredit: true
}
```