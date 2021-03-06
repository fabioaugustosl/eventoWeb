
eventoApp.factory('relatorioIngressoService', function($http, $log){
	
	//var urlPadrao = 'http://localhost:3000'; //'http://ec2-52-11-115-221.us-west-2.compute.amazonaws.com:81'
	var urlPadrao = 'http://34.218.156.195:3000';

	var urlIngresso = urlPadrao+'/api/ingresso/v1/';
	var urlIngressoUtil = urlPadrao+'/api/ingressoutil/v1/';


	var getDistribuicaoIngressosPorDia = function(fcCallback){
		$http.get(urlIngressoUtil+'/distribuicao/credibom')
			.then(
				function(data, status, headers, config){
					//console.log('voltou para o callback service relatorio distribuicao por dia ',data);
					fcCallback(data.data);
				},
				function(data, status, headers, config){
					
				}
			);

	};


	var getDistribuicaoIngressosPorConfiguracao = function(fcCallback){
		$http.get(urlIngressoUtil+'/distribuicaoporconfiguracao/credibom')
			.then(
				function(data, status, headers, config){
					//console.log('voltou para o callback service relatorio distribuicao por configuracao ',data);
					fcCallback(data.data);
				},
				function(data, status, headers, config){
					
				}
			);

	};


	var getDistribuicaoIngressosPorUsuario = function(idEvento, fcCallback){
		console.log('getDistribuicaoIngressosPorUsuario');
		$http.get(urlIngressoUtil+'/distribuicaoporusuario/'+idEvento)
			.then(
				function(data, status, headers, config){
					//console.log('voltou para o callback service relatorio distribuicao por configuracao ',data);
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


	var getEntradasEventoPorCategoria = function(idEvento, fcCallback){
		$http({method:'GET', url:urlIngressoUtil+'entradasporcategoria/'+idEvento})
			.then(
				function(data){
					fcCallback(data.data);
				}
			);	

	};


	var getEntradasEventoPorHora = function(idEvento, fcCallback){
		$http({method:'GET', url:urlIngressoUtil+'entradasevento/'+idEvento})
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
		getEntradasEventoPorCategoria : getEntradasEventoPorCategoria,
		getEntradasEventoPorHora : getEntradasEventoPorHora,
		getDistribuicaoIngressosPorUsuario : getDistribuicaoIngressosPorUsuario

	};


});
