const ct = require('../controllers/empresa');

module.exports = (server) => {

    // obtem todas as informações da empresa para exibir na pagina "Sobre"
    server.get('/empresa/sobre', async (req, res) => {
        const result = await ct.controllers().obterDadosCompletos(req);
        res.send(result);
    })

}