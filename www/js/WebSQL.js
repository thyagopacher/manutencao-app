//Test for browser compatibility
if (window.openDatabase) {
    var mydb = openDatabase("manutencao2", "0.1", "Banco de Manutenção", 200000);
    mydb.transaction(function (t) {
        /**criação da tabela de equipamento*/
        var sql1 = "CREATE TABLE IF NOT EXISTS equipamento (codequipamento INTEGER PRIMARY KEY ASC, ";
        sql1 += "periodo integer, nome varchar(50) not null default '', codempresa integer)";
        t.executeSql(sql1);

        /**criação da tabela de serviço*/
        var sql2 = "CREATE TABLE IF NOT EXISTS servico (codservico INTEGER PRIMARY KEY ASC, ";
        sql2 += "nome varchar(50) not null default '', codempresa integer)";
        t.executeSql(sql2);

        /**criação da tabela de manutenção*/
        var sql3 = "CREATE TABLE IF NOT EXISTS manutencao (codmanutencao INTEGER PRIMARY KEY ASC, ";
        sql3 += "codempresa integer, tipo varchar(1) not null default 'p', codequipamento integer, valor decimal(10,2) not null default 0.0, ";
        sql3 += "valor_gasto decimal(10,2) not null default 0.0, demais_observacoes text not null default '', ";
        sql3 += "pendencias text not null default '', data datetime, datafim datetime)";
        t.executeSql(sql3);

        /**criação da tabela de empresa*/
        var sql4 = "CREATE TABLE IF NOT EXISTS empresa (codempresa INTEGER PRIMARY KEY ASC, ";
        sql4 += "razao varchar(50) not null default '', logo varchar(50) not null default '')";
        t.executeSql(sql4);

        /**criação da tabela de status manutenção*/
        var sql5 = "CREATE TABLE IF NOT EXISTS statusmanutencao (codstatus INTEGER PRIMARY KEY ASC, ";
        sql5 += "nome varchar(50) not null default '')";
        t.executeSql(sql5);

        /**criação da tabela de executor*/
        var sql6 = "CREATE TABLE IF NOT EXISTS executor (codexecutor INTEGER PRIMARY KEY ASC, ";
        sql6 += "nome varchar(50) not null default '', codempresa integer not null default 0)";
        t.executeSql(sql6);
    });
} else {
    console.err("WebSQL não é suportado pelo seu browser!");
}

function atualizar() {
    if (mydb) {
        var make = document.getElementById("carmake").value;
        var model = document.getElementById("carmodel").value;
        var codigo = 0;

        //Test to ensure that the user has entered both a make and model
        if (make !== "" && model !== "") {
            //Insert the user entered details into the cars table, note the use of the ? placeholder, these will replaced by the data passed in as an array as the second parameter
            mydb.transaction(function (t) {
                t.executeSql("update cars set = ?, model = ? where codigo = ?", [make, model, codigo]);
                outputCars();
            });
        }
    } else {
        console.err("Banco não encontrado, seu browser não suporta websql!");
    }
}

//function to get the list of cars from the database

function listar() {
    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
        mydb.transaction(function (t) {

            t.executeSql('SELECT * FROM equipamento', [], function (t, results) {
                var len = results.rows.length, i;
                if (len > 0) {
                    for (i = 0; i < len; i++) {
                        alert(results.rows.item(i).text);
                    }
                } else {
                    console.log("Nada encontrado para a tabela");
                }
            });
        });

    } else {
        console.err("Banco não encontrado, seu browser não suporta websql!");
    }
}

/**
 * função para inserir novas empresas ou atualiza caso o nome já exista
 */
function salvarEmpresa(empresa) {
    if (mydb) {
        mydb.transaction(function (t) {
            var valores = [empresa["razao"], empresa["logo"], empresa["codempresa"]];
            t.executeSql('SELECT codempresa from empresa where razao = ? and codempresa = ?', [empresa["razao"], empresa["codempresa"]], function (t, data) {
                if (data.rows[0].codempresa != undefined && data.rows[0].codempresa != "") {
                    t.executeSql("update empresa set razao = ?, logo = ? where codempresa = ?", valores);
                } else {
                    t.executeSql("INSERT INTO empresa (razao, logo, codempresa) VALUES (?, ?, ?)", valores);
                }
            });
        });
    } else {
        console.err("Banco não encontrado, seu browser não suporta websql!");
    }
}

/**
 * função para inserir novos equipamentos ou atualiza caso o nome já exista
 */
function salvarEquipamento(equipamento) {
    if (mydb) {
        mydb.transaction(function (t) {
            var valores = [equipamento["nome"], equipamento["periodo"], equipamento["codempresa"], equipamento["codequipamento"]];
            t.executeSql('SELECT codequipamento from equipamento where nome = ? and codempresa = ?', [equipamento["nome"], equipamento["codempresa"]], function (t, data) {
                var equipamento = data.rows[0];
                if (equipamento != undefined && equipamento.codequipamento != undefined && equipamento.codequipamento != "") {
                    t.executeSql("update equipamento set nome = ?, periodo = ? where codempresa = ? and codequipamento = ?", valores);
                } else {
                    t.executeSql("INSERT INTO equipamento (nome, periodo, codempresa, codequipamento) VALUES (?, ?, ?, ?)", valores);
                }
            });
        });
    } else {
        console.err("Banco não encontrado, seu browser não suporta websql!");
    }
}

/**
 * função para inserir novos executors ou atualiza caso o nome já exista
 */
function salvarExecutor(executor) {
    if (mydb) {
        mydb.transaction(function (t) {
            var valores = [executor["nome"], executor["codempresa"], executor["codexecutor"]];
            t.executeSql('SELECT codexecutor from executor where nome = ? and codempresa = ?', [executor["nome"], executor["codempresa"]], function (t, data) {
                if (data.rows[0].codexecutor != undefined && data.rows[0].codexecutor != "") {
                    t.executeSql("update executor set nome = ? where codempresa = ? and codexecutor = ?", valores);
                } else {
                    t.executeSql("INSERT INTO executor (nome, codempresa, codexecutor) VALUES (?, ?, ?, ?)", valores);
                }
            });
        });
    } else {
        console.err("Banco não encontrado, seu browser não suporta websql!");
    }
}

/**
 * função para inserir novos servicos ou atualiza caso o nome já exista
 */
function salvarServico(servico) {
    if (mydb) {
        mydb.transaction(function (t) {
            var valores = [servico["nome"], servico["codempresa"], servico["codservico"]];
            t.executeSql('SELECT codservico from servico where nome = ? and codempresa = ?', [servico["nome"], servico["codempresa"]], function (t, data) {
                if (data.rows[0].codservico != undefined && data.rows[0].codservico != "") {
                    t.executeSql("update servico set nome = ? where codempresa = ? and codservico = ?", valores);
                } else {
                    t.executeSql("INSERT INTO servico (nome, codempresa, codservico) VALUES (?, ?, ?, ?)", valores);
                }
            });
        });
    } else {
        console.err("Banco não encontrado, seu browser não suporta websql!");
    }
}

/**
 * função para inserir novos status de manutenção ou atualiza caso o nome já exista
 */
function salvarStatusManutencao(status) {
    if (mydb) {
        mydb.transaction(function (t) {
            var valores = [status["nome"], status["codstatus"]];
            t.executeSql('SELECT codstatus from statusmanutencao where nome = ?', status["nome"], function (t, data) {
                if (data.rows[0].codstatus != undefined && data.rows[0].codstatus != "") {
                    console.log("Status já havia sido inserido antes!");
                } else {
                    t.executeSql("INSERT INTO statusmanutencao (nome) VALUES (?)", valores);
                }
            });
        });
    } else {
        console.err("Banco não encontrado, seu browser não suporta websql!");
    }
}

function excluir(id) {
    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
        mydb.transaction(function (t) {
            t.executeSql("DELETE FROM cars WHERE id=?", [id], listar);
        });
    } else {
        console.err("Banco não encontrado, seu browser não suporta websql!");
    }
}
