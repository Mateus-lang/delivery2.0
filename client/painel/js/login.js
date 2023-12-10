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
            alert("informe o E-mail, por favor.");
            document.querySelector("#txtEmailLogin").focus();
            return;
        }

        if(senha.length == 0) {
            alert("informe a Senha, por favor.");
            document.querySelector("#txtsenhaLogin").focus();
            return;
        }

        login.method.login(email, senha);

    },

    // metodo que faz o login (via API)
    login: (email, senha) => {
        var dados = {
            email: email,
            senha: senha
        }

        app.method.post('/login', JSON.stringify(dados),
            (response) => {
                console.log(response);
            },
            (error) => {
                console.log(error);
            }, true
        )

    }
}