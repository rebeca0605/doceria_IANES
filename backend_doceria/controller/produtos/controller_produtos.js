/********************************************************************************************************
* Objetivo: Arquivo responsável pela manipulação e dados entre o app e a model para o crud de produtos.
* Data: 30/05/2026
* Autor: Rebeca Gomes
* Versão: 1.0
*********************************************************************************************************/

const produtosDAO = require('../../model/produtos.js')
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')

// Retorna uma lista de todos os produtos
const listarProdutos = async function () {
    // Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        let resultProdutos = await produtosDAO.getSelectAllProduct()

        if (resultProdutos) {
            
            if (resultProdutos.length > 0) {
                MESSAGES.DEFAULT_HEADER.items = { produtos: resultProdutos }

                return MESSAGES.DEFAULT_HEADER // Status 200
            } else {
                return MESSAGES.ERROR_NOT_FOUND // Status 404
            }
        } else {
            return MESSAGES.ERROR_NOT_FOUND // Status 404 (Caso o banco retorne false/vazio)
        }
    } catch (error) {
        console.error("Erro interno na controller de produtos:", error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // Status 500
    }
}

// Retorna um produto pelo id
const buscarProdutoId = async function (id) {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (id !== '' && id !== null && !isNaN(id) && Number(id) > 0) {

            let resultProdutos = await produtosDAO.getProductById(Number(id))
            
            if (resultProdutos) {
                
                if (resultProdutos.id_produtos) {
                    
                    MESSAGES.DEFAULT_HEADER.items = { produtos: resultProdutos }

                    return MESSAGES.DEFAULT_HEADER // Retorna Status 200 com os dados
                } else {
                    return MESSAGES.ERROR_NOT_FOUND // Status 404
                }
            } else {
                return MESSAGES.ERROR_NOT_FOUND // Status 404 (caso o ID não exista no banco)
            }
        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' (id incorreto ou menor que zero)'
            return MESSAGES.ERROR_REQUIRED_FIELDS // Status 400
        }
    } catch (error) {
        console.error("Erro interno na controller:", error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // Status 500
    }
}

module.exports = {
    listarProdutos,
    buscarProdutoId
}