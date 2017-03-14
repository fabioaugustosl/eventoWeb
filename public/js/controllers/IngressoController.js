

eventoApp.controller('IngressoController',
	function ($scope, ingressoService){
		
		$scope.tituloPagina = 'Ingressos';
		
		var getIngressos = function(){
			ingressoService.getIngressos(function(resultado){
				$scope.ingressos = resultado;
			});		
		};

		getIngressos();

	}
);

