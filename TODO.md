# - TODO List
---
## *GERAL*
```
- Na criação de um novo usuário inserir 2 categorias padrão ('Sem Categoria' e 'Todas'), que não podem ser alteradas pelo usuario.
```
## *SERVER*
```
- Refatorar todos os router's para ficar como o categoria router.
- Completar a atualização de categorias. 
Ex.: Realizar sequencia de updates:
	- db.categorias.update( {pai:"Alimentacao"}, {$set:{pai:"Alimentacao-NOVO"}} , { multi: true })
	- db.categorias.update( {pai:"Alimentacao-NOVO"}, { $pull: {ancestrais: "Alimentacao" } } , { multi: true }  )
	- db.categorias.update( {pai:"Alimentacao-NOVO"}, { $push: {ancestrais: "Alimentacao-NOVO" } },  { multi: true } )

```
## *CLIENT*
```
- Geral: Remover referencia a modulos/componentes do template, não utilizados no commons-pages module
- Incluir componente de breadcrump

```
