/********************************************************************************************************
* Objetivo: Arquivo responsável pelas requisições pela API da doceria.
* Data: 30/05/2026
* Autor: Rebeca Gomes
* Versão: 1.0
*********************************************************************************************************/

require('dotenv').config() 

const express = require('express') 
const cors = require('cors') 
const bodyParser = require('body-parser') 

const app = express()
app.use(cors())
app.use(bodyParser.json())

const PORT = process.env.PORT || 8080

const controllerUsuario = require('./controller/usuarios/controller_usuarios.js')
const controllerProdutos = require('./controller/produtos/controller_produtos.js')


// rota de usuario
app.get('/v1/doceria/usuario/:id', async function (request, response) {
    let idUsuario = request.params.id

        let usuario = await controllerUsuario.buscarUsuarioId(idUsuario)
        
        const statusCode = usuario.status_code || (usuario.message ? 400 : 200)
        
        response.status(statusCode)
        response.json(usuario)
    })


//rota de doces
app.get('/v1/doceria/produtos', cors(), async function (request, response) {
    //Chama a função para listar filmes do banco de dados
    let produtos = await controllerProdutos.listarProdutos()
    const statusCode = produtos.status_code || (produtos.message ? 400 : 200)
    response.json(produtos)
})

app.get('/v1/doceria/produtos/:id', async function (request, response) {
    let idProduto = request.params.id
    let produto = await controllerProdutos.buscarProdutoId(idProduto)
    
    const statusCode = produto.status_code || 200
    response.status(statusCode)
    response.json(produto)
})

// Start na API
app.listen(PORT, function () {
    console.log(`API aguardando requisições na porta ${PORT}...`)
})