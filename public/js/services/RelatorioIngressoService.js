
eventoApp.factory('relatorioIngressoService', function($http, $log){
	
	var urlPadrao = 'http://localhost:3000'; //'http://ec2-52-11-115-221.us-west-2.compute.amazonaws.com:81'
	//var urlPadrao = 'http://ec2-52-11-115-221.us-west-2.compute.amazonaws.com:81';

	var urlIngresso = urlPadrao+'/api/ingresso/v1/';
	var urlIngressoUtil = urlPadrao+'/api/ingressoUtil/v1/';


	var getDistribuicaoIngressosPorDia = function(fcCallback){
		$http.get(urlIngressoUtil+'/distribuicao/produminas')
			.then(
				function(data, status, headers, config){
					console.log('voltou para o callback service relatorio distribuicao por dia ',data);
					fcCallback(data.data);
				},
				function(data, status, headers, config){
					
				}
			);

	};


	var getDistribuicaoIngressosPorConfiguracao = function(fcCallback){
		$http.get(urlIngressoUtil+'/distribuicaoPorConfiguracao/produminas')
			.then(
				function(data, status, headers, config){
					console.log('voltou para o callback service relatorio distribuicao por configuracao ',data);
					fcCallback(data.data);
				},
				function(data, status, headers, config){
					
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


	var getEntradasEventoPorHora = function(idEvento, fcCallback){
		$http({method:'GET', url:urlIngressoUtil+'entradasEvento/'+idEvento})
			.then(
				function(data){
					fcCallback(data.data);
				}
			);	

	};


	return {
		getTotalIngressosEvento : getTotalIngressosEvento,
		getDistribuicaoIngressosPorDia : getDistribuicaoIngressosPorDia,
		getDistribuicaoIngressosPorConfiguracao :getDistribuicaoIngressosPorConfiguracao,
		getEntradasEventoPorHora : getEntradasEventoPorHora
	};


});
