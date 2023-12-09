global.config = require('./config').get('dev');

const restify = require("restify");
const path = require("path");
const recursiveReaddir = require("recursive-readdir");

// Cria o servidor
const server = restify.createServer({
    name: 'Delivery',
    version: '1.0.0'
});

// adiciona as extensões do resty para o funcionamento do JSON nas requisições
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.urlEncodedBodyParser());

// Adiciona todas as rotas dentro da inicialização do server (para escutar as rotas na pasta routes)
const pathFiles = path.resolve(path.resolve('./').concat('/server/routes'));

recursiveReaddir(pathFiles, ['!*.js'], (err, files) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    files.forEach(element => { require(element)(server)})
});

// Utilizado para não dar problema derequisições no Chrome (CORS)

server.use(
    function nocache(req,res,next){
        res.header("Acess-Control-Allow-Origin", "*");
        res.header("Acess-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept");
        res.header("Pragma", "no-cache");
        next();
    }
);

// Modifica o Array de erro e mostra uma mensagem personalizada
server.on('restifyError', function(req, res, err, callback) {
    err.toJSON = function customToJSON(){
        return {
            Erro: 'Página não encontrada :/'
        }
    };
    return callback();
});

module.exports = Object.assign({ server, restify, config });