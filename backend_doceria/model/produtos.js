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

const setInsertProduct = async function (produto) {
    try {
        const sql = `INSERT INTO tbl_produtos (
                        nome, 
                        massa, 
                        recheio, 
                        cobertura, 
                        preco, 
                        tipo_porcao, 
                        quantidade, 
                        data_vencimento
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

        const precoFinal = (produto.preco === '' || produto.preco === undefined) ? null : produto.preco

        const result = await db.raw(sql, [
            produto.nome, 
            produto.massa, 
            produto.recheio, 
            produto.cobertura,
            precoFinal, 
            produto.tipo_porcao, 
            produto.quantidade, 
            produto.data_vencimento
        ])

        if (result && result[0]) {
            return result[0].insertId 
        } else {
            return false
        }

    } catch (error) {
        console.error("ERRO DENTRO DO CATCH DA MODEL:", error)
        return false
    }
}

// Altera um produto no banco de dados
const setUpdateProduct = async function (produto) {
    try {
        let sql = `update tbl_produtos set
                        nome = ?,
                        massa = ?, 
                        recheio = ?, 
                        cobertura = ?, 
                        preco = ?, 
                        tipo_porcao = ?, 
                        quantidade = ?, 
                        data_vencimento = ?

                    where id_produtos = ?`

        const precoFinal = (produto.preco === '' || produto.preco === undefined) ? null : produto.preco

        const result = await db.raw(sql, [
            produto.nome,
            produto.massa,
            produto.recheio,
            produto.cobertura,
            precoFinal,
            produto.tipo_porcao,
            produto.quantidade,
            produto.data_vencimento,
            produto.id 
        ])

        if (result)
            return true
        else
            return false

    } catch (error) {
        console.error("ERRO NO UPDATE DA MODEL:", error)
        return false
    }
}

// Remove o produto desativando temporariamente a trava de chaves estrangeiras
const setDeleteProduct = async function (id, idUsuario) {
    try {
        // 1. Cria o registro no histórico de descarte normalmente
        let sqlHistorico = `insert into tbl_historico_descarte (
                                quantidade_descarte, data_descarte, fk_id_usuarios, fk_id_produtos
                            ) values (1, now(), ?, ?)`
        await db.raw(sqlHistorico, [idUsuario, id])

        // 2. DESATIVA as travas de Foreign Key para o MySQL permitir o delete
        await db.raw('SET FOREIGN_KEY_CHECKS = 0;')

        // 3. Executa o delete do produto
        let sqlDelete = `delete from tbl_produtos where id_produtos = ?`
        const result = await db.raw(sqlDelete, [id])

        // 4. REATIVAS as travas de segurança imediatamente (MUITO IMPORTANTE)
        await db.raw('SET FOREIGN_KEY_CHECKS = 1;')

        // Valida se a exclusão afetou linhas no banco
        if (result && result[0] && result[0].affectedRows > 0) {
            return true
        } else {
            return false
        }
    } catch (error) {
        // Garante que se algo der errado no meio do caminho, as chaves voltam a ser protegidas
        await db.raw('SET FOREIGN_KEY_CHECKS = 1;')
        console.log("Erro na Model ao deletar/salvar histórico: ", error)
        return false
    }
}

//Retorna o último id gerado no banco de dados
const getSelectLastId = async function () {
    try {
        //Script sql para retornar apenas o último id do banco
        const sql = `select id_produtos from tbl_produtos order by id_produtos desc limit 1`

        const result = await db.raw(sql)

        if (Array.isArray(result))
            return Number(result[0].id_produtos)
        else
            return false

    } catch (error) {
        return false
    }
}


module.exports = {
    getSelectAllProduct,
    getProductById,
    setInsertProduct,
    setUpdateProduct,
    setDeleteProduct,
    getSelectLastId
}