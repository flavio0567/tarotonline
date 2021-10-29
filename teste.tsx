/////////// Identificando o Mktime do Servidor
// Antes de começarmos a ações relacionadas ao atendimento, precisamos 
// gravar em uma variável local, a Data / Hora do servidor, e atualizar esta 
// informação constantemente.

// Esta informação é essencial para fazermos os cálculos de tempo gasto e 
// valor gasto precisamos antes identificar o Horário do servidor.

// Para isto, fazemos um GET ao endpoint: *** OK ***
/outros/hora-servidor /
	
// Onde iremos ter o retorno do Mktime do servidor:
{
   "Mktime":999999999999999999
}

// Localmente, fazemos uma função que soma 1 segundo a cada segundo, o que nos 
// faz ter um horário bem aproximado do servidor: *** OK ***
window.setInterval(function(){
    
    AttDet_MKTIME				= AttDet_MKTIME + 1;
    
}, 1000);


////////// Criando Atendimento
// Para criar um atendimento, faça um POST para o Endpoint abaixo com o tipo 
// de atendimento e o código do atendente: *** OK ***
	atendimentos/chat/{ CodigoAtendente }/

	// Nos dados retornados a informação mais importante esta no objeto "Firebase":
"Firebase":{
   "ApiKey":"XXXXXXXXXXXXXXXXX",
   "DatabaseURL":"https://XXXXXXXXXXXX.firebaseio.com/",
   "Hash":"XXXXXXXXXXXX"
}

///////// Conectando no Firebase
// Inicialmente carregue a SDK do Firebase:
<script src="https://www.gstatic.com/firebasejs/5.8.3/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/5.8.3/firebase-database.js"></script>
<script src="https://www.gstatic.com/firebasejs/5.8.3/firebase-auth.js"></script>

// Agora iremos conectar na DatabaseURL com a ApiKey: *** OK ***
var config 				= {
apiKey: {apiKey},
databaseURL: {databaseURL}
};

firebase.initializeApp(config);


/////// Monitorando mudanças nas informações do Atendimento

// Agora iremos nos conectar ao atendimento para receber as 
// informações do atendimento: *** OK ***
Sck_Obj_Dados 		= firebase.database().ref('/atendimentos/{Hash}/dados/');
Sck_Obj_Dados.on('value', function(snapshot) {
    
    if( snapshot.exists() )
    {
            
        DadsRet			= snapshot.val();
        
        console.log(DadsRet);
        
    }
    
});

// Esta conexão é feita monitorando o evento "value" na referência:
/atendimentos/{ Hash }/dados/

// As principais informações que iremos monitorar aqui são:
//  
//  CodigoStatus:
//  Código de status de atendimento(Monitore este campo para
//  identificar quando exibir que o atendimento foi finalizado) 

//  IsIniciadoCobranca:
//  Retorna "S" para "Sim" e "N" para "Não", tem como finalidade permitir 
//  identificar o momento que podemos exibir o valor gasto ao cliente

//  InicioCobranca:
//  Retorna o MKTIME do momento que a cobrança foi iniciada

//  CliCreditos:
//  Retorna o valor em créditos que o cliente tem disponível em sua conta

//  AttValorPorMinuto:
//  Retorna o valor por minuto que será cobrado neste atendimento

//  CliQtdSegundos:
//  Quantidade de segundos que o cliente tem disponível para o atendimento


///////// Monitorando Mensagens

// Agora iremos nos conectar ao atendimento para receber as mensagens que foram enviadas: 
Sck_Obj_Mensagens 	= firebase.database().ref('/atendimentos/{Hash}/mensagens/');
Sck_Obj_Mensagens.on('child_added', function(snapshot) {

    if( snapshot.exists() )
    {
        
        DadsRet			= snapshot.val();

        console.log(DadsRet);

    }
    
});

// Esta conexão é feita monitorando o evento "child_added" na referência:
/atendimentos/{ Hash }/mensagens/

// Neste evento, cada disparo corresponde ao objeto de uma mensagem:
{
  "OriTipo": "A",
  "Mensagem": "Teste de Mensagem",
  "Mktime": 9999999,
  "Mktime2": 9999999
}

// As principais informações que iremos monitorar aqui são:

// OriTipo: Retorna "A" quando a mensagem foi enviada por um "Atendente" e "C"
// quando foi enviada por um "Cliente"

// Mensagem: Retorna a Mensagem enviada
// Mktime: Que corresponde a data/hora em que a mensagem foi enviada


//////// Enviando Mensagens

// Agora que já temos os dados do atendimento e uma conexão com as mensagens 
// iremos enviar uma nova mensagem, para isto:
var AssDados 						= {};
AssDados["OriTipo"] 				= "C";
AssDados["Mensagem"] 				= "Teste";
AssDados["Mktime"] 					= AttDet_MKTIME;
AssDados["Mktime2"] 				= AttDet_MKTIME;

Sck_Obj_Mensagens.push(AssDados);

// Onde precisamos enviar:

// OriTipo: Sempre enviar "C"
// Mensagem: A mensagem que esta sendo enviada
// Mktime/Mktime2: Este é o mktime do servidor

// Estes dados precisamos ser enviados como um novo objeto para a referência:
/atendimentos/{ Hash }/mensagens/


//////// Finalizando Atendimento

// Para finalizarmos um atendimento, fazemos um POST ao endpoint:
/atendimentos/finalizar/{CodigoAtendimento}/

	
// O retorno de sucesso é um HttpCode 204.

	
///////////////// Entendendo os Status
	
// Na referência "/atendimentos/{Hash}/dados/", uma das informações retornadas 
// é o "CodigoStatus".
 
// Através desta informação modelamos o layout da tela(Exibindo / Ocultando dados)
// e geramos alertas ao cliente.
 ​
// Quando o atendimento em um dos status abaixo, indica que o atendente ainda 
// não aceitou o atendimento:

// 0: Aguardando Atendimento

// 1: Atendimento Iniciado - Cobrança não iniciada
 ​
// No momento que o atendente aceitar o atendimento, o status muda para:
// 2: Atendimento Iniciado - Cobrança iniciada ​
// E se mantem neste status até o atendimento finalizar.
	
// Quando o atendimento finalizar o sistema ira retornar um status indicando a 
// causa da finalização:

// 3: Atendimento Finalizado por Cliente

// 4: Atendimento Finalizado por Atendente

// 5: Atendimento Finalizado por Timeout do Cliente

// 6: Atendimento Finalizado por Timeout do Atendente

// 7: Atendimento Finalizado por Créditos Insuficientes




///////////// Calculando o Tempo Restante do Atendimento
// Para este cálculo precisamos de algumas informações que são retornadas na 
// referência "/atendimentos/{Hash}/dados/"(Utilizando o Firebase):

// IsIniciadoCobranca: Indicando se a cobrança foi iniciada

// InicioCobranca: MKTIME em que a cobrança foi iniciada

// CliQtdSegundos: A quantidade de segundos máxima do atendimento
​
// Além destas informações precisamos do MKTIME do servidor, que neste caso, esta 
// salvo na variável:
// AttDet_MKTIME
​
	// Lembrando que o MKTIME do servidor deve ser atualizado a cada segundo com 
	// o acréscimo de 1 segundo
​
// Com estas informações precisamos calcular  o tempo máximo e o tempo já gasto,
// utilizando a lógica abaixo:
= ( AttDet_MKTIME - AttDet_InicioCobranca ) - AttDet_CliQtdSegundos 
​
// Ou seja:

// Primeiro identificamos a diferença, em segundos, entre o mktime de início da 
// cobrança e o mktime atual

// Com o resultado anterior, subtrairmos a quantidade e segundos que o cliente 
// tem disponível
​
// Segue exemplo utilizando Javascript:
if( AttDet_IsIniciadoCobranca == "S" )
{
	
		Tempo										= AttDet_MKTIME - AttDet_InicioCobranca;
		QtdSegundos							= AttDet_CliQtdSegundos;
		DiffTempo								= QtdSegundos - Tempo;
		QtdMinutos							= Math.round(DiffTempo/60);
		
		AttDet_SegundosGastos		= QtdMinutos;
		AttDet_QtdMinRest				= QtdMinutos;
		AttDet_TempoRest				= DiffTempo;
	
}else{
	
		AttDet_SegundosGastos		= 0;
		AttDet_QtdMinRest				= -1;
		AttDet_TempoRest				= -1;
	
}

// Onde temos como resultado:
// AttDet_SegundosGastos: Quantidade de segundos gastos no atendimento

// AttDet_QtdMinRest: Quantidade de minutos restantes

// AttDet_TempoRest: Quantidade de segundos restantes

// Observe que apenas deve ser exibido ao cliente, as informações de tempo, quando 
// a informação "IsIniciadoCobranca" receber o valor "S".
// Este valor é retornado no momento que o atendente aceita o atendimento e 
// entra no atendimento.

