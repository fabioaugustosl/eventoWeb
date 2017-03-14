

eventoApp.controller('PrincipalController',
	function ($scope, $routeParams, $location){
		
		$scope.tituloPagina = 'Bem vindo!';


		$scope.goToDashboard = function(){
			$location.replace();
			$location.url('/dashboard');
			$scope.tituloPagina = 'Dashboard';
		};

		$scope.goToUser = function(){
			$location.replace();
			$location.url('/user');
			$scope.tituloPagina = 'Usuário';
		};
		
		$scope.irParaIngressos = function(){
			$location.replace();
			$location.url('/ingressos');
			$scope.tituloPagina = 'Ingressos';
		};

		$scope.irParaNovoIngresso = function(){
			$location.replace();
			$location.url('/novoIngresso');
			$scope.tituloPagina = 'Novo Ingresso';
		};

	}
);

