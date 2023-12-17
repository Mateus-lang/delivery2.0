const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();
const UsuarioAcessoToken = require('../common/protecaoAcesso');
const Acesso = new UsuarioAcessoToken();

const crypto = require('crypto');

const controllers = () => {

    const login = async (req) => {

        var password = req.body.senha;
        
        // Validar se o usuário existe no banco de dados
        var ComandoSql = await readCommandSql.retornaStringSql('login', 'login');
        var usuarioBanco = await db.Query(ComandoSql, req.body);

        if (usuarioBanco !=undefined && usuarioBanco.length > 0) {
            // existe usuario no banco

            // Validar se as senhas são iguais
            var hashSenha = crypto.createHmac('sha256', password).digest('hex');

            console.log('Senha do usuário: ', hashSenha);
            console.log('Senha no Banco: ', usuarioBanco[0].senha);

            if(hashSenha.toLocaleLowerCase() != usuarioBanco[0].senha.toLocaleLowerCase()){
                return{
                status: 'error',
                message: "Usuário ou senha incorretos" //senha incorreta
                }
            }

            // Se estiver tudo ok, gera o token e retorna o JSON
            var tokenAcesso = Acesso.gerarTokenAcesso(usuarioBanco[0])

            return{
                status: 'success',
                TokenAcesso: tokenAcesso,
                Nome: usuarioBanco[0].nome,
                Email: usuarioBanco[0].email,
                Logo: usuarioBanco[0].logotipo
            }


        }

        else {
            return {
                status: 'error',
                message: "Usuário ou senha incorretos" //Usuário não cadastrado no sistema
            }
        }
        

    };

    return Object.create ({
        login
    })

}

module.exports = Object.assign({controllers})