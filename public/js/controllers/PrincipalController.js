

eventoApp.controller('PrincipalController',
	function ($scope, $routeParams, $location, $sessionStorage, $mdDialog, eventoService){
		
		$scope.tituloPagina = 'Bem vindo!';

		$sessionStorage.dono = "produminas";
		//$sessionStorage.eventoSelecionado = {'idEvento':'ev01', 'nome':'Show Teste'};


		$scope.evento = $sessionStorage.eventoSelecionado;
		
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

		$scope.irParaConfigurarEvento = function(){
			$location.replace();
			$location.url('/configurarEvento');
			$scope.tituloPagina = 'Configuração do evento';
		};

		$scope.irParaTempoReal = function(){
			$location.replace();
			$location.url('/tempoReal');
			$scope.tituloPagina = 'Tempo Real';
		};


		$scope.selecionarEvento = function() {

			$mdDialog.show({
	      		controller: DialogController,
	      		templateUrl: '/view/dialogs/selecaoEvento.tmpl.html',
	      		parent: angular.element(document.body),
	      		//targetEvent: ev,
	      		clickOutsideToClose:false,
	      		fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
	    	})
	    	.then(function(evento) {
	    		$sessionStorage.eventoSelecionado = evento;
	    		$scope.goToDashboard();
	    		
	    		$.notify({
	            	icon: 'ti-gift',
	            	message: "Evento selecionado <b>"+evento.titulo+"</b> - Produminas"
	            },{
	                type: 'success',
	                timer: 4000
	            });

	    		$("#menuLateral").show();
	    		$("#painelPrincipal").show();
	    		

	    	}, function() {
	    		
	    		// TODO :  ir para tela de cadastro do evento
	    		$scope.status = 'You cancelled the dialog.';
	    	});
	  	};


	  	if(!$scope.evento){
	  		$scope.selecionarEvento();
	  	}
	  	


	  	function DialogController($scope, $mdDialog, eventoService) {

	  		var getEventos = function(){

	  			eventoService.getEventos(function(resultado){
	  				console.log(resultado);
					$scope.eventos = resultado;
					
				});		
			};

			
		    $scope.novoEvento = function() {
		      $mdDialog.cancel();
		    };

		    $scope.selecionarEvento = function(evento) {
		      $mdDialog.hide(evento);
		    };

		    getEventos();
		  }

	}
);

