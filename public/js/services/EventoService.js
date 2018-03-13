
eventoApp.factory('eventoService', function($http, $log){
	
	//var urlPadrao = 'http://localhost:3000';
	var urlPadrao = 'http://34.218.156.195:3000'
	
	var urlEndereco = urlPadrao+'/api/endereco/v1/';
	var urlEnderecoEvento = urlPadrao+'/api/enderecoEvento/v1/';
	var urlEvento = urlPadrao+'/api/evento/v1/';

	var getEventos = function(fcCallback){
		//http://ec2-52-11-115-221.us-west-2.compute.amazonaws.com:81/api/evento/v1

		$http.get(urlEvento)
			.then(
				function(data){
					console.log(data);

					fcCallback(data.data);
				},
				function(data){
					console.log('erro get EVentos');
				}
			);

	};

	var getEvento = function(id, fcCallback){
		//http://ec2-52-11-115-221.us-west-2.compute.amazonaws.com:81/api/evento/v1

		$http.get(urlEvento +id)
			.then(
				function(data, status, headers, config){
					fcCallback(data.data);
				},
				function(data, status, headers, config){
				}
			);
	};


	var getEndereco = function(idEvento, fcCallback){
		//http://ec2-52-11-115-221.us-west-2.compute.amazonaws.com:81/api/evento/v1

		$http.get(urlEnderecoEvento+idEvento).
				then(
					function(data){
						fcCallback(data.data);
					}
				);


	};


	var salvarEndereco = function(endereco, fcCallback, fcCallbackError){
		
		if(endereco._id){
			//http://ec2-52-11-115-221.us-west-2.compute.amazonaws.com:81/api/evento/v1/
			$http.patch(urlEndereco+endereco._id, endereco).
				then(
					function(status){
						fcCallback("Endereço atualizado com sucesso.");
					},
					function(){
						fcCallbackError("Ocorreu um erro ao atualizar o endereço do evento.");
					}
				);
				
		} else {
			//http://ec2-52-11-115-221.us-west-2.compute.amazonaws.com:81/api/evento/v1/
			$http.post(urlEndereco, endereco)
				then(
					function(status){
						fcCallback("Endereço atualizado com sucesso.");
					},
					function(){
						fcCallbackError("Ocorreu um erro ao atualizar o endereço do evento.");
					}
				);	
		}
		
	};



	var salvarEvento = function(evento, fcCallback, fcCallbackError){
		
		if(evento._id){
			//http://ec2-52-11-115-221.us-west-2.compute.amazonaws.com:81/api/evento/v1/
			$http.patch(urlEvento+evento._id, evento).
				then(
					function(status){
						fcCallback("Evento atualizado com sucesso.");
					},
					function(){
						fcCallbackError("Ocorreu um erro ao atualizar os dados do evento.");
					}
				);
				
		} else {
			//http://ec2-52-11-115-221.us-west-2.compute.amazonaws.com:81/api/evento/v1/
			$http.post(urlEvento, evento)
				.then(
					function(data, status, headers, config){
						fcCallback("Evento criado com sucesso.");
					},
					function(data, status, headers, config){
						fcCallbackError("Ocorreu um erro ao salvar o evento.");
					}
				);
				
		}

		
	};

	return {
		getEndereco :getEndereco, 
		salvarEndereco : salvarEndereco,
		getEventos : getEventos,
		getEvento :getEvento, 
		salvar : salvarEvento
	};


});
