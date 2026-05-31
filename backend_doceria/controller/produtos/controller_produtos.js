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

//Insere um produto
const inserirProduto = async function (produto, contentType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (String(contentType).toLowerCase().includes('application/json')) {
            let validar = await validarDadosProduto(produto)

            if (!validar) {
                // Aqui resultProdutos vai receber o número do ID gerado (ex: 5)
                let resultProdutos = await produtosDAO.setInsertProduct(produto)

                // Se resultProdutos for um número (ID válido), entra aqui direto!
                if (resultProdutos) {

                    produto.id = resultProdutos // Coloca o ID gerado direto no objeto

                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
                    MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message
                    MESSAGES.DEFAULT_HEADER.items = produto

                    return MESSAGES.DEFAULT_HEADER // Status 201 de Sucesso!
                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500 (Se a model retornou false)
                }
            } else {
                return validar // 400
            }
        } else {
            return MESSAGES.ERROR_CONTENT_TYPE // 415
        }
    } catch (error) {
        console.error("👉 ERRO DENTRO DO CATCH DA CONTROLLER:", error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

//Atualiza um produto filtrando pelo id
const atualizarProduto = async function (produto, id, contentType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDadosProduto(produto)

            if (!validar) {

                // COMENTAMOS A VALIDAÇÃO DO ID PARA TESTAR O UPDATE DIRETO
                // let validarId = await buscarProdutoId(id)

                produto.id = Number(id)

                // Executa o update direto no banco
                let resultProdutos = await produtosDAO.setUpdateProduct(produto)

                if (resultProdutos) {
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_UPDATED_ITEM.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                    MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_UPDATED_ITEM.message
                    MESSAGES.DEFAULT_HEADER.items = produto

                    return MESSAGES.DEFAULT_HEADER //200
                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                }

            } else {
                return validar //400 referente a validação dos dados
            }
        } else {
            return MESSAGES.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        console.error("👉 ERRO REAL NA CONTROLLER:", error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER || { status: false, status_code: 500 }
    }
}

//Exclui um produto gerenciando o histórico de descarte
const excluirProduto = async function(id, idUsuario){
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if(!isNaN(id) && id != '' && id != null && id > 0 && !isNaN(idUsuario) && idUsuario != null){

            // Manda os dois IDs para a model fazer a operação casada
            let resultProdutos = await produtosDAO.setDeleteProduct(Number(id), Number(idUsuario))

            if(resultProdutos){
                MESSAGES.DEFAULT_HEADER.status          = MESSAGES.SUCCESS_DELETED_ITEM.status
                MESSAGES.DEFAULT_HEADER.status_code     = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                MESSAGES.DEFAULT_HEADER.message         = MESSAGES.SUCCESS_DELETED_ITEM.message
                delete MESSAGES.DEFAULT_HEADER.items

                return MESSAGES.DEFAULT_HEADER // 200 Sucesso real!
            }else{
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500 se o produto não existir ou houver trava de FK
            }
        }else{
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [id do produto ou usuário incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS // 400
        }

    } catch (error) {
        console.log("Erro na controller: ", error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

const validarDadosProduto = async function (produto) {
    // Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    if (produto.nome == '' || produto.nome == undefined || produto.nome == null || produto.nome.length > 100) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ` [Nome incorreto]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (produto.massa == '' || produto.massa == undefined || produto.massa == null || produto.massa.length > 50) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ` [Massa incorreta]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (produto.recheio == '' || produto.recheio == undefined || produto.recheio == null || produto.recheio.length > 100) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ` [Recheio incorreto]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (produto.cobertura == '' || produto.cobertura == undefined || produto.cobertura == null || produto.cobertura.length > 100) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ` [Cobertura incorreta]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (produto.preco !== undefined && produto.preco !== null && produto.preco !== '' && (isNaN(produto.preco) || Number(produto.preco) < 0)) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ` [Preço incorreto (deve ser um número positivo)]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (produto.tipo_porcao == '' || produto.tipo_porcao == undefined || produto.tipo_porcao == null || produto.tipo_porcao.length > 20) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ` [Tipo de porção incorreto (máximo 20 caracteres)]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (produto.quantidade == '' || produto.quantidade == undefined || produto.quantidade == null || isNaN(produto.quantidade) || Number(produto.quantidade) < 0) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ` [Quantidade incorreta]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if (produto.data_vencimento == undefined || produto.data_vencimento == null || produto.data_vencimento.length != 10) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ` [Data de vencimento incorreta (use o formato AAAA-MM-DD)]`
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else {
        return false
    }
}

module.exports = {
    listarProdutos,
    buscarProdutoId,
    inserirProduto,
    atualizarProduto,
    excluirProduto,
    validarDadosProduto
}