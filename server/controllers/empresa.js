const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();
const UsuarioAcessoToken = require('../common/protecaoAcesso');
const Acesso = new UsuarioAcessoToken();



const controllers = () => {

    const obterDadosCompletos = async (req) => {

        try {
            
            var ComandoSql = await readCommandSql.retornaStringSql('obterDadosCompletos', 'empresa');
            var result = await db.Query(ComandoSql);

            return {
                status: 'success',
                data: result
            }

        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao obter dados da empresa'
            }
        }        

    };

    return Object.create ({
        obterDadosCompletos
    })

}

module.exports = Object.assign({controllers})