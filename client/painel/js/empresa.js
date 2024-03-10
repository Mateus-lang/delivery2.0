document.addEventListener("DOMContentLoaded", function(event){
    empresa.event.init();
});

var empresa = {};
var DADOS_EMPRESA = {};

var MODAL_UPLOAD = new bootstrap.Modal(document.getElementById('modalUpload'));

var DROP_AREA = document.getElementById("drop-area");

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

        // inicializa o drag and drop da imagem 

        // previne os comportamentos padroes do navegador
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            DROP_AREA.addEventListener(eventName, empresa.method.preventDefaults, false);
            document.body.addEventListener(eventName, empresa.method.preventDefaults, false);
        });

        // evento quando passa o mouse em cima com a imagem segurada(hover)
        ['dragenter', 'dragover'].forEach(eventName => {
            DROP_AREA.addEventListener(eventName, empresa.method.highlight, false);
        });

        // evento quando sai o mouse de cima
        ['dragleave', 'drop'].forEach(eventName => {
            DROP_AREA.addEventListener(eventName, empresa.method.unhighlight, false);
        });

        // evento quando solta a imagem no container
        DROP_AREA.addEventListener('drop', empresa.method.handleDrop, false);

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

    //Valida os campos e salva os dados da empresa (TAB sobre)
    salvarDadosSobre: () => {
        let nome = document.getElementById("txtNomeEmpresa").value.trim();
        let sobre = document.getElementById("txtSobreEmpresa").value.trim();

        if( nome.length <= 0){
            app.method.mensagem('Informe o nome da empresa, por favor.');
            document.getElementById("txtNomeEmpresa").focus();
            return;
        }

        let dados = {
            nome: nome,
            sobre: sobre
        }

        app.method.loading(true);

        app.method.post('/empresa/sobre', JSON.stringify(dados),
            (response) => {

                console.log('response', response)
                app.method.loading(false);

                if(response.status === 'error') {
                    app.method.mensagem(response.message)
                    return;

                }

                app.method.mensagem(response.message,'green');

                // atualizar o localstorage

                app.method.gravarValorStorage(nome, 'Nome');

                empresa.method.obterDados();
                app.method.carregarDadosEmpresa();

            },
            (error) => {

                console.log('error', error);
                app.method.loading(false);

            }
        );

    },

    // adiciona a nova logo da empresa
    uploadLogo: (logoUpload= []) => {
        MODAL_UPLOAD.hide();

        var formData = new FormData();

        if(logoUpload != undefined) {
            formData.append('image', logoUpload[0])

        }else{
            formData.append('image', document.querySelector('#fileElem').files[0]);
        }

        app.method.loading(true);

        app.method.upload('/image/logo/upload', formData,
            (response) => {

                app.method.loading(false);

                if (response.status == "error") {
                    app.method.mensagem(response.message);
                    return;
                }

                app.method.mensagem(response.message, 'green');

                // atualiza o valor no localStorage
                app.method.gravarValorStorage(response.logotipo, 'Logo');

                empresa.method.obterDados();
                app.method.carregarDadosEmpresa();

            },
            (error) => {
                console.log('error', error);
                app.method.loading(false);

            }
        );
    },

    // remove o logo da empresa
    removeLogo: () => {

        var data = {
            imagem: DADOS_EMPRESA.logotipo
        }

        app.method.loading(true);

        app.method.post('/image/logo/remove', JSON.stringify(data),
            (response) => {

                console.log(response)
                app.method.loading(false);

                if (response.status == "error") {
                    app.method.mensagem(response.message);
                    return;
                }

                app.method.mensagem(response.message, 'green');

                // remover o valor no localStorage
                app.method.removerSessao('Logo');

                empresa.method.obterDados();
                app.method.carregarDadosEmpresa();

            },
            (error) => {
                console.log('error', error);
                app.method.loading(false);

            }
        );

    },

    // abre a modal de adicioanr logo
    openModalLogo: () => {
            MODAL_UPLOAD.show();
    },

    // drag and drop - previne os comportamentos padrões
    preventDefaults: (e) => {
        e.preventDefault();
        e.stopPropagation();
    },

    // drag and drop - adiciona a classe 'highlight' quando entra com a imagem no container
    highlight: (e) => {
        if(!DROP_AREA.classList.contains('highlight')) {
            DROP_AREA.classList.add('highlight');            
        }
    },

    // drag and drop - adiciona a classe 'highlight' quando sai com a imagem no container
    unhighlight: (e) => {
        DROP_AREA.classList.remove('highlight');
    },

    // drag and drop - quando solta a imagem no container
    handleDrop: (e) => {
        var dt = e.dataTransfer;
        var files = dt.files;

        empresa.method.uploadLogo(files);
    },

    obterHorarios: () => {

    },

}