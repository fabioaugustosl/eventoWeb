
eventoApp.factory('ingressoService', function($http, $log){
	
	var getIngressos = function(fcCallback){
		$http({method:'GET', url:'http://ec2-52-11-115-221.us-west-2.compute.amazonaws.com:81/api/ingresso/v1/'})
		.success(function(data, status, headers, config){
			console.log("Sucesso no request",data);
			fcCallback(data);
		})
		.error(function(data, status, headers, config){
			console.log("error no request");
			$log.warn(data, status, headers(), config);
		});
	};

	var novoIngresso = function(novoIngresso){
		console.log("Ingresso novo: ", novoIngresso);
		$http.post('http://ec2-52-11-115-221.us-west-2.compute.amazonaws.com:81/api/ingresso/v1/', novoIngresso)
			.success(function(data, status, headers, config){
				console.log("Sucesso no request POST - salvar novo ingresso",data);
			})
			.error(function(data, status, headers, config){
				console.log("error no request POST - novo ingresso");
				$log.warn(data, status, headers(), config);
		});
	};

	return {
		getIngressos : getIngressos,
		novoIngresso : novoIngresso
	};


});
