var tempo = new Number();
var contando = false;
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    console.log(navigator.camera);
    lerQRCode();
}

function contaTempo() {
    if (contando) {
        tempo++;
        if (tempo >= 3) {
            var html = '<div class="alert alert-danger"><strong>Atenção!</strong> Procure um local com sinal mais forte de 3G ou com Wi-Fi e acione o botão abaixo para ver a manutenção desejada </div>';
            $("#lista_manutencao").html(html);
        }
        setTimeout('contaTempo()', 1000);
    }
}

function rodaDadosEquipamento(data) {
    var html = '';
    $.each(data, function (i, item) {
        logo = item.logo;
        var servicos = item.servicos;
        var manutencao = item.manutencao;

        if (logo !== undefined && logo !== null && logo !== "") {
            localStorage.setItem('logo', logo);
        }
        salvarEquipamento({ nome: manutencao.equipamento, codequipamento: manutencao.codequipamento, periodo: manutencao.periodo, codempresa: manutencao.codempresa });
        html += '<div id="nome_equipamento" class="col-md-12">' + manutencao.equipamento + '</div>';

        if (manutencao.tipo === "c") {
            html += '<div class="col-md-12 titulo_red">';
            html += 'MANUTENÇÃO CORRETIVA';
            html += '</div>';
        } else if (manutencao.tipo === "p") {
            html += '<div class="col-md-12 titulo_red">';
            html += 'MANUTENÇÃO PREVENTIVA';
            html += '</div>';
        }
        html += '<div class="col-md-12">';
        html += 'DATA PROGRAMADA:' + manutencao.data2 + '</br>';
        if (manutencao.datafim2 !== "00/00/0000") {
            html += 'DATA TERMINO:' + manutencao.datafim2 + '</br>';
        }
        html += 'Periodo:';
        if (manutencao.periodo == 1) {
            html += ' Diário</br>';
        } else if (manutencao.periodo == 2) {
            html += ' Semanal</br>';
        } else if (manutencao.periodo == 3) {
            html += ' Mensal</br>';
        } else if (manutencao.periodo == 4) {
            html += ' Anual</br>';
        } else if (manutencao.periodo == 5) {
            html += ' Dias não sequenciais</br>';
        }
        html += 'EXECUTOR:' + manutencao.executor + '</br>';
        html += 'SERVIÇOS:';
        var qtd = servicos.length;
        for (var j = 0; j < qtd; j++) {
            var servico = servicos[j];
            salvarServico(servico);
            html += servico.nome + '; ';
        }
        html += '<br>';
        html += 'VALOR PREVISTO: R$ ' + parseFloat(manutencao.valor).toFixed(2).replace('.', ',') + '</br>';
        html += 'VALOR GASTO: R$ ' + parseFloat(manutencao.valor_gasto).toFixed(2).replace('.', ',');
        html += '</br>';
        html += 'STATUS:' + manutencao.status + '</br>';
        html += 'OBSERVAÇÃO:' + manutencao.demais_observacoes + '</br>';
        if (manutencao.pendencias != undefined && manutencao.pendencias != null && manutencao.pendencias != "") {
            html += 'PENDÊNCIAS:' + manutencao.pendencias + '</br>';
        }
        html += '</div>';
    });

    /**pegando logo gravada caso não tenha logo vindo por ajax*/
    if (logo === undefined || logo === null || logo === "") {
        logo = localStorage.getItem('logo');
    }
    if (logo !== undefined && logo !== null && logo !== "") {
        $("#logo").prop("src", 'https://manutencaoqrcode.gestccon.com.br/arquivos/' + logo);
        $("#logo").show();
    } else {
        $("#logo").hide();
    }

    $("#lista_manutencao").html(html);
}

// Função para LER QRCode
function lerQRCode() {
    contando = true;
    contaTempo();
    console.log("Ler QRCode");

    cordova.plugins.barcodeScanner.scan(
        function (result) {
            var logo = '';
            var html = '<h4 id="titulo_geral">RELATÓRIO DE MANUTENÇÕES</h4>';
            var qrcode = result.text.split('-');
            if (result.text.indexOf("-") != -1) {
                qrcode = result.text.split('-');
                qrcode = qrcode[1];
            } else if (result.text.indexOf("#") != -1) {
                qrcode = result.text.split('#');
                qrcode = qrcode[1];
            } else {
                qrcode = result.text;
            }

            //                alert("We got a barcode\n" +
            //                        "Result: " + result.text + "\n" +
            //                        "Format: " + result.format + "\n" +
            //                        "Cancelled: " + result.cancelled);
            var key_pesquisa = 'pesquisa_' + qrcode;
            if (navigator.onLine) {
                $.ajax({
                    url: "https://manutencaoqrcode.gestccon.com.br/control/ProcurarManutencaoEquipamentoJSON.php",
                    type: "POST",
                    data: { qrcode: qrcode },
                    dataType: 'json',
                    success: function (data, textStatus, jqXHR) {
                        if (data.situacao !== false) {
                            localStorage.setItem(key_pesquisa, JSON.stringify(data));
                            contando = false;
                            rodaDadosEquipamento(data);

                        } else if (data.situacao === false) {
                            swal("Erro", data.mensagem, "error");
                        }
                    }, msgErro
                });
            } else {
                console.log('Você se encontra offline - dados carregados do celular se houver');
                var dados = localStorage.getItem(key_pesquisa);
                if (dados != undefined && dados != null) {
                    contando = false;
                    rodaDadosEquipamento(JSON.parse(dados));
                } else {
                    contando = true;
                    swal("Atenção", "Você se encontra sem internet, e não tem essa consulta gravada !", "info");
                }
            }
        },
        function (error) {
            alert("Scanning failed: " + error);
        },
        {
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
        }
    );
}