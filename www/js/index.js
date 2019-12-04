var online = navigator.onLine;

var msgErro = function (jqXHR, textStatus, errorThrown) {
    if (jqXHR.status == 500) {
        // Server side error
        swal("Atenção", "Ocorreu um erro no script do servidor contate a equipe de suporte!", "info");
    } else if (jqXHR.status == 404) {
        // Not found
        swal("Atenção", "Procure um local com sinal mais forte de 3g ou com wifi e acione o botão abaixo para ver a manutenção desejada", "info");
    } else{
        swal("Erro", errorThrown, "error");
    }
}

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

function contatoQRCode() {
    swal({
        title: "Contato:",
        text: "Para entrar em contato deve ler uma placa de qrcode antes!",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Sim, pode ler!",
        cancelButtonText: "Não",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            lerQRCodeContato();
        } else {
            swal("Cancelado", "Não podemos enviar o contato sem antes realizar leitura!", "info");
        }
    });
}

function confirmarMsg() {
    swal("Contato", 'E-mail enviado com sucesso', "success");
}

function enviarContato() {
    if ($("#mensagem").val() == "") {
        swal("Atenção", "Não pode enviar sem mensagem!", "info");
    } else {
        $.ajax({
            url: "https://manutencaoqrcode.gestccon.com.br/control/ContatoAPPJSON.php",
            type: "POST",
            data: $("#fcontato").serialize(),
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
                if (data.situacao) {
                    confirmarMsg();
                    setTimeout('closeBrowser();', 1500);
                } else {
                    swal("Erro", data.mensagem, "error");
                }
            }, msgErro
        });
    }
}

function closeBrowser() {
    if (history.length == 1) {
        window.open('mobile/close');
    } else {
        history.back();
    }
}

// Função para LER QRCode
function lerQRCodeContato() {
    cordova.plugins.barcodeScanner.scan(function (result) {
        var qrcode = result.text;
        if(qrcode.indexOf('-') != -1){
            qrcode = qrcode.split('-');
            qrcode = qrcode[1];
        }
        if (qrcode != undefined && qrcode != "") {
            localStorage.setItem('ultQrCodeLido', qrcode);
        }        
        window.open('contato.html');

    }, function (error) {
        swal("Erro", "Erro ao realizar escaneamento: " + error, "error");
    }, {
        preferFrontCamera: false, // iOS and Android
        showFlipCameraButton: true, // iOS and Android
        showTorchButton: true, // iOS and Android
        torchOn: true, // Android, launch with the torch switched on (if available)
        prompt: "Coloque um código de barras dentro da área de digitalização", // Android
        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
        orientation: "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
        disableAnimations: true, // iOS
        disableSuccessBeep: false // iOS
    });
}