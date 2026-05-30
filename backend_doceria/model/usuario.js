/******************************************************************************************************
 * Objetivo: Arquivo responsavel pelo CRUD referente a tabela de USUÁRIO
 * Data: 30/05/2026
 * Autor: Rebeca Gomes
 * Versão: 1.0
 * ****************************************************************************************************/

const db = require('../src/database.js')

const getUserById = async function (id) {
    try {
        const sql = `select * from tbl_usuarios where id_usuarios = ?`

        const result = await db.raw(sql, [id])
        
        return result[0][0]

    } catch (error) {
        console.error("Erro ao buscar o usuário:", error)
        throw error;
    }
}
 
module.exports = {
    getUserById
}