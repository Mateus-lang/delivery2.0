document.addEventListener("DOMContentLoaded", function(event){
    empresa.event.init();
});

var empresa = {};
var DADOS_EMPRESA = {};

empresa.event = {

    init: () => {

        app.method.validaToken();
        app.method.carregarDadosEmpresa();


        var tooltipList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipList.map(function(element){
            new bootstrap.Tooltip(element)
        });

        // inicia a primeira TAB
        empresa.method.openTab('sobre');

    }

}

empresa.method = {

    // responsável por abrir as TABS e chamar os metodos iniciais de cada uma
    openTab: (tab) => {

        Array.from(document.querySelectorAll(".tab-content")).forEach(e => e.classList.remove('active'));
        Array.from(document.querySelectorAll(".tab-item")).forEach(e => e.classList.add('hidden'));

        document.querySelector("#tab-" + tab).classList.add('active');
        document.querySelector("#" + tab).classList.remove('hidden');

        switch (tab) {
            case 'sobre':
                empresa.method.obterDados();
                break;

            case 'endereco':
                empresa.method.obterDados();
                break;

            case 'horario':
                empresa.method.obterHorarios();
                break;
        
            default:
                break;
        }

    },


    // obtem os dados da empresa
    obterDados: () => {

        app.method.get('/empresa/sobre',
            (response) => {

                if (response.status == "error") {
                    app.method.mensagem(response.message);
                    return;
                }

                let empresa = response.data[0]

                DADOS_EMPRESA = empresa;

                // carrega a TAB sobre
                if (empresa.logotipo != null && empresa.logotipo != '') {
                    document.getElementById("img-empresa").style.backgroundImage = `url('../public/images/empresa/${empresa.logotipo}')`;
                    document.getElementById("img-empresa").style.backgroundSize = '70%';
                    document.getElementById("btn-editar-logo").classList.add('hidden');
                    document.getElementById("btn-remover-logo").classList.remove('hidden');
                }
                else {
                    document.getElementById("img-empresa").style.backgroundImage = `url('../public/images/default.jpg')`;
                    document.getElementById("img-empresa").style.backgroundSize = 'cover';
                    document.getElementById("btn-editar-logo").classList.remove('hidden');
                    document.getElementById("btn-remover-logo").classList.add('hidden');
                }

                document.getElementById("txtNomeEmpresa").value = empresa.nome;
                document.getElementById("txtSobreEmpresa").innerHTML = empresa.sobre.replace(/\n/g, '\r\n');


                // carrega a TAB endereço

            },
            (error) => {

                console.log('error', error)

            }
        );

    },

    obterHorarios: () => {

    }

}