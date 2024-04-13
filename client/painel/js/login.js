document.addEventListener("DOMContentLoaded", function(event){
    login.event.init();
});


var login = {};

login.event = { 

    init: () => {
        document.querySelector("#btnLogin").onclick = () => {
            login.method.validarLogin();
        }
    }

}

login.method = {

    // valida os campos
    validarLogin: () => {
        
        let email = document.querySelector("#txtEmailLogin").value.trim();
        let senha = document.querySelector("#txtSenhaLogin").value.trim();

        if(email.length == 0) {
            app.method.mensagem("informe o E-mail, por favor.");
            document.querySelector("#txtEmailLogin").focus();
            return;
        }

        if(senha.length == 0) {
            app.method.mensagem("informe a Senha, por favor.");
            document.querySelector("#txtSenhaLogin").focus();
            return;
        }

        login.method.login(email, senha);

    },

    // metodo que faz o login (via API)
    login: (email, senha) => {
        var dados = {
            email: email,
            senha: senha,
        }
        
        console.log("Enviando dados para o servidor:", dados);

        app.method.post('/login', JSON.stringify(dados),
            (response) => {
                
                console.log("Resposta do servidor:", response);

                if (response.status == 'error') {
                    app.method.mensagem(response.message);
                    return;
                }

                if (response.status == "success") {

                    app.method.gravarValorStorage(response.TokenAcesso, "token");
                    app.method.gravarValorStorage(response.Nome, "Nome");
                    app.method.gravarValorStorage(response.Email, "Email");
                    app.method.gravarValorStorage(response.Logo, "Logo");

                    window.location.href = "/painel/home.html";
                    
                }

            },
            (error) => {
                console.log("Erro na solicitação:", error);
            }, true
        )

    }
}