
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


	/*recupera as ultimas entradas a partir de uma data*/
	var getIngressosEntrada = function(dataReferencia, fcCallback){
		var e = [{'nomeCliente': 'Fabio', 'dataBaixa': new Date(), 'guicheBaixa':'guiche 01'}];
		fcCallback(e);
		/*$http({method:'GET', url:urlIngresso+'?dataBaixa='+dataReferencia})
			.then(
					function(data, status, headers, config){
						console.log('voltou para o callback service ',data);
						fcCallback(data.data);
					},
					function(data, status, headers, config){
						console.log(data);
						
					}
				);*/

	};



	var novoIngresso = function(novoIngresso, fcCallback, fcError){
		console.log("Ingresso novo: ", novoIngresso);
		$http.post(urlIngresso, novoIngresso)
				.then(
					function(data, status, headers, config){
						fcCallback(data.data);
					},
					function(data, status, headers, config){
						console.log(data);
						fcError(data.data);
					}
				);	
			
	};


	var removerIngresso = function(idIngresso, idConfiguracao, fcCallback){
		$http.delete(urlIngresso+idIngresso)
				.then(
					function(status){
						console.log('call back service remover ingresso');
						fcCallback(idIngresso, idConfiguracao);
					}
				);	
			
	};


	var salvarConfiguracao = function(configuracao, fcCallback, fcCallbackError){

		if(configuracao._id){
			$http.patch(urlConfiguracaoIngresso+configuracao._id, configuracao).
				then(
					function(data, status){
						console.log('service callback sucesso configuracao', data);
						fcCallback(data.data);
					},
					function(data){
						console.log('service callback ERRO configuracao', data);
						fcCallbackError(data.data);
					}
				);
				
		} else {
			console.log(configuracao);
			$http.post(urlConfiguracaoIngresso, configuracao)
				.then(
					function(data, status){
						console.log('service callback sucesso configuracao', data);
						fcCallback(data.data);
					},
					function(data){
						console.log('service callback ERRO configuracao', data);
						fcCallbackError(data.data);
					}
				);	
		}
		
	};


	var removerConfiguracao = function(configuracao, fcCallback, fcCallbackError){
		
		$http.delete(urlConfiguracaoIngresso+configuracao._id).
				then(
					function(data, status){
						fcCallback(configuracao);
					},
					function(data){
						fcCallbackError(data.data);
					}
				);
		
		
	};


	var getConfiguracoes = function(idEvento, fcCallback){
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
		getIngressosEntrada : getIngressosEntrada,
		novoIngresso : novoIngresso,
		removerIngresso :removerIngresso
	};


});
