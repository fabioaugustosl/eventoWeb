
eventoApp.factory('ingressoService', function($http, $log){
	
	var urlPadrao = 'http://localhost:3000'; //'http://ec2-52-11-115-221.us-west-2.compute.amazonaws.com:81'

	var urlIngresso = urlPadrao+'/api/ingresso/v1/';
	var urlConfiguracaoIngresso = urlPadrao+'/api/configuracaoIngresso/v1/';
	var urlIngressoUtil = urlPadrao+'/api/ingressoUtil/v1/';


	var getIngressos = function(fcCallback){
		$http({method:'GET', url:urlIngresso})
			.then(
					function(data, status, headers, config){
						fcCallback(data.data);
					},
					function(data, status, headers, config){
						
					}
				);

	};



	var novoIngresso = function(novoIngresso, fcCallback){
		console.log("Ingresso novo: ", novoIngresso);
		$http.post(urlIngresso, novoIngresso)
				.then(
					function(data, status, headers, config){
						fcCallback(data.data);
					},
					function(data, status, headers, config){
						
					}
				);	
			
	};


	var removerIngresso = function(idIngresso, fcCallback){
		$http.delete(urlIngresso+idIngresso)
				.then(
					function(status){
						alert('call back service remover ingresso');
						fcCallback(idIngresso);
					}
				);	
			
	};


	var salvarConfiguracao = function(configuracao, fcCallback, fcCallbackError){

		if(configuracao._id){
			$http.patch(urlConfiguracaoIngresso+configuracao._id, configuracao).
				then(
					function(status){
						fcCallback("Configuração de ingressos atualizada com sucesso.");
					},
					function(){
						fcCallbackError("Ocorreu um erro ao atualizar o configuração de ingressos.");
					}
				);
				
		} else {
			console.log(configuracao);
			$http.post(urlConfiguracaoIngresso, configuracao)
				.then(
					function(status){
						fcCallback("Configuração de ingressos salva com sucesso.");
					},
					function(){
						fcCallbackError("Ocorreu um erro ao salvar nova configuração de ingressos.");
					}
				);	
		}
		
	};


	var removerConfiguracao = function(idConfiguracao, fcCallback, fcCallbackError){
		
		$http.delete(urlConfiguracaoIngresso+idConfiguracao).
				then(
					function(status){
						fcCallback("Configuração de ingressos removida com sucesso.");
					},
					function(){
						fcCallbackError("Ocorreu um erro ao remover a configuração de ingressos.");
					}
				);
		
		
	};


	var getConfiguracoes = function(idEvento, fcCallback){
		alert(urlConfiguracaoIngresso+'?idEvento='+idEvento);
		$http.get(urlConfiguracaoIngresso+'?idEvento='+idEvento)
			.then(
				function(data){
					console.log(data);
					fcCallback(data.data);
				}
			);	

	};


	var getTotalIngressosEvento = function(idEvento, fcCallback){
		$http({method:'GET', url:urlIngressoUtil+'quantidade/'+idEvento})
			.then(
				function(data){
					fcCallback(data.data);
				}
			);	

	};


	return {
		getTotalIngressosEvento : getTotalIngressosEvento,
		salvarConfiguracao : salvarConfiguracao,
		removerConfiguracao : removerConfiguracao,
		getConfiguracoes : getConfiguracoes,
		getIngressos : getIngressos,
		novoIngresso : novoIngresso,
		removerIngresso :removerIngresso
	};


});
