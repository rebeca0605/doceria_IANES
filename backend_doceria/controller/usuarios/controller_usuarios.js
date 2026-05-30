/********************************************************************************************************
* Objetivo: Arquivo responsável pela manipulação e dados entre o app e a model para o crud de USUÁRIOS.
* Data: 30/05/2026
* Autor: Rebeca Gomes
* Versão: 1.0
*********************************************************************************************************/

const usuariosDAO = require('../../model/usuario.js')
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')

const buscarUsuarioId = async function (id) {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (id !== '' && id !== null && !isNaN(id) && Number(id) > 0) {

            let resultUsuarios = await usuariosDAO.getUserById(Number(id))
            
            if (resultUsuarios) {
                
                if (resultUsuarios.id_usuarios) {
                    
                    MESSAGES.DEFAULT_HEADER.items = { usuarios: resultUsuarios }

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
    buscarUsuarioId
}