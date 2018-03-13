
eventoApp.factory('logService', function($http, $log){
	
	//var urlPadrao = 'http://localhost:3000';
	var urlPadrao = 'http://34.218.156.195:3000'
	
	var urlLog = urlPadrao+'/api/log/v1/';

	
	var getLogs = function(tipo, idEvento, fcCallback){
		$http.get(urlLog+"?dono="+idEvento+"&tipo="+tipo)
			.then(
				function(data){
					console.log(data);
					fcCallback(data.data);
				},
				function(data){
					console.log('erro get logs');
				}
			);

	};


	var novoLog = function(tipo, idEvento, descricao){
		
		var logNovo = {'dono':idEvento, 'tipo': tipo, 'descricao': descricao};

		$http.post(urlLog, logNovo)
				.then(
					function(data, status, headers, config){
						//fcCallback("Evento criado com sucesso.");
					},
					function(data, status, headers, config){
						//fcCallbackError("Ocorreu um erro ao salvar o evento.");
					}
				);

	};



	return {
		getLogs : getLogs,
		novo : novoLog
	};


});
