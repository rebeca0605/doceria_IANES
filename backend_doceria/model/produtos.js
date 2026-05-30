/******************************************************************************************************
 * Objetivo: Arquivo responsavel pelo CRUD referente a tabela de USUÁRIO da aplicação SyncroBaby
 * Data: 30/05/2026
 * Autor: Rebeca Gomes
 * Versão: 1.0
 * ****************************************************************************************************/

const db = require('../src/database.js')

const getSelectAllProduct = async function () {
    try {
        const sql = `select * from tbl_produtos order by id_produtos asc`

        const result = await db.raw(sql)

        if (Array.isArray(result) && result[0].length > 0)
            return result[0]
        else
            return false 
            
    } catch (error) {
        console.error("Erro ao buscar todos os produtos:", error)
        throw error;
    }
}


const getProductById = async function (id) {
    try {
        const sql = `select * from tbl_produtos where id_produtos = ?`

        const result = await db.raw(sql, [id])
        
        return result[0][0]

    } catch (error) {
        console.error("Erro ao buscar o produto:", error)
        throw error;
    }
}
 
module.exports = {
    getSelectAllProduct,
    getProductById
}