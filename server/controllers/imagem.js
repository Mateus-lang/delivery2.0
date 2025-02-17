const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();
const UsuarioAcessoToken = require('../common/protecaoAcesso');
const Acesso = new UsuarioAcessoToken();

const mv = require('mv');
const fs = require('fs');

const controllers = () => {

    // Faz o upload do logotipo da empresa
    const uploadLogo = async (req) => {

        try {
            
            // obtem o id da empresa logada
            let _empresaId = Acesso.retornaCodigoTokenAcesso('IdEmpresa', req);

            const imagem = req.files.image;

            let name = imagem.name.split('.');

            const extension = name[name.length - 1];

            const new_path = `server/public/images/empresa/${name[0]}.${extension}`;

            mv(imagem.path, new_path, {
                mkdirp: true //se não existir, cria um diretório
            }, (err, result) => {
                if (err) {
                    return false;
                }
            })

            var ComandoSql = await readCommandSql.retornaStringSql('adicionarImagem', 'empresa');
            await db.Query(ComandoSql, {
                idempresa: _empresaId,
                logotipo: `${name[0]}.${extension}`
            });


            return {
                status: 'success',
                message: 'Imagem atualizada com sucesso!',
                logotipo: `${name[0]}.${extension}`
            }

        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao salvar imagem, tente novamente.'
            }
        }        

    };

    // Remove o logotipo da empresa
    const removeLogo = async (req) => {

        try {
            
            // obtem o id da empresa logada
            let _empresaId = Acesso.retornaCodigoTokenAcesso('IdEmpresa', req);

            const imagem = req.body.imagem;

            var filePath = `server/public/images/empresa/${imagem}`;

            fs.unlinkSync(filePath);

            var ComandoSql = await readCommandSql.retornaStringSql('removerImagem', 'empresa');
            await db.Query(ComandoSql, { idempresa: _empresaId });


            return {
                status: 'success',
                message: 'Imagem removida com sucesso!',
                
            }

        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: 'Falha ao remover imagem, tente novamente.'
            }
        }        

    };

    return Object.create ({
        uploadLogo,
        removeLogo
    })

}

module.exports = Object.assign({controllers})