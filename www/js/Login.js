/**
 * realiza login pelo app onde é feito via android ou iphone e logando no sistema web pega 
 * informações do form pelo e-mail e senha
 * @param {string} email 
 * @param {string} senha 
 * */
function loginApp(email, senha) {
    if (email == null || email == "") {
        swal("Atenção", "Por favor preencha e-mail!", "info");
    } else if (senha == null || senha == "") {
        swal("Atenção", "Por favor preencha senha!", "info");
    } else if (email != null && email != ""
            && senha != null && senha != "") {
        $.ajax({
            url: "https://manutencaoqrcode.gestccon.com.br/control/LoginAPP.php",
            type: "POST",
            data: {email: email, senha: senha},
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
                if (data.situacao == true) {
                    localStorage.setItem('dtcadastro', data.dtcadastro);
                    localStorage.setItem('nome', data.nome);
                    localStorage.setItem('imagem', data.imagem);
                    localStorage.setItem('codpessoa', data.codpessoa);
                    localStorage.setItem('codempresa', data.codempresa);
                    localStorage.setItem('email', $("#email").val());
                    localStorage.setItem('senha', $("#senha").val());
                    location.href = "index.html";//redireciona caso tenha sucesso no login
                } else {
                    swal("Erro", data.mensagem, "error");
                }
            }, error: function (jqXHR, textStatus, errorThrown) {
                swal("Erro", "Erro causado por: " + errorThrown, "error");
            }
        });
    }
}

function loginSocial(rede) {
    if (rede == 1) {//Facebook
//        loginFacebook();
        swal("Atenção", "Em desenvolvimento!", "info");
    } else if (rede == 2) {//Twitter
        swal("Atenção", "Em desenvolvimento!", "info");
    } else if (rede == 3) {//Google+
        swal("Atenção", "Em desenvolvimento!", "info");
    } else {
        swal("Atenção", "Em desenvolvimento!", "info");
    }
}

var fbLoginSuccess = function (userData) {
    if (userData.status == "connected") {
        facebookConnectPlugin.api('/me', ["public_profile", "email"], function (response) {
            localStorage.setItem('logado', 's');
            localStorage.setItem('idfacebook', response.id);
            console.log('Successful login for: ' + response.name);
            location.href = "index.html";
        });
    } else {
        console.log("Não conseguiu entrar no login do facebook!");
    }
}

function closeBrowser(){
    if(history.length==1){
        window.open('mobile/close');
    }else{
        history.back();
    }
}

function loginFacebook() {
    facebookConnectPlugin.login(["public_profile", "email"],
            fbLoginSuccess,
            function (error) {
                console.log("" + error);
            }
    );
}

function checkConnection() {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
    console.info('Connection type: ' + states[networkState]);
}

$(window).load(function () {
    checkConnection();
    if(!navigator.onLine){
        console.error('Não tem conexão de internet!');
        $("#btLogin").prop('title', "Você está desconectado então os dados vão ser pegos gravados da sua última consulta online");
    }else{
        console.log("Conexão a internet ativa!");
        $("#btLogin").prop('title', 'Clique para fazer o login ao sistema');
    }

    //iniciando a conexão setando id do aplicativo e versão usada
    facebookConnectPlugin.browserInit('975126059290829', 'v2.8');
    facebookConnectPlugin.getLoginStatus(function onLoginStatus(userData) {
        if (userData.status == "connected") {
            console.log("Já tinha se conectado anteriormente!");
            location.href = "index.html";
        } else {
            console.log("Não conseguiu entrar no login do facebook!");
        }
    }, function (error) {
        console.log("" + error);
    });
});

$(function () {

    $("#btLogin").click(function () {
        loginApp($("#email").val(), $("#senha").val());
    });

    /**realiza o login automaticamente quando as variáveis já estiverem gravadas.*/
    var email = localStorage.getItem("email");
    var senha = localStorage.getItem("senha");
    if ((email !== null && email !== ""
            && senha !== null && senha !== "")
            || (localStorage.getItem("logado") == "s")) {
        location.href = "index.html";
    }
});