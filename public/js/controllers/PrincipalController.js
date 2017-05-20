
 

eventoApp.controller('PrincipalController',
	function ($scope, $routeParams, $location, $sessionStorage, $mdDialog, md5, eventoService, pessoaService, loginService){
		

		$scope.currentUser = null;
  		//$scope.isAuthorized = AuthService.isAuthorized;
  		$scope.setCurrentUser = function (user) {
	    $scope.currentUser = user;
	  };


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
			$scope.tituloPagina = 'Clientes';
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


		$scope.logout = function(){
			console.log('logout');
			var cb = function(){
				console.log('logout cb');
				//$location.url('/');
				 $location.path('/');
    			$scope.$apply();
			};

			loginService.logout(cb);
		};

		$scope.ehAdmin = function(){
			return loginService.isAuthorized('admin');
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
	    		
	    		$.notify({
	            	icon: 'ti-gift',
	            	message: "Evento selecionado <b>"+evento.titulo+"</b> - Produminas"
	            },{
	                type: 'success',
	                timer: 4000
	            });

	            $scope.evento = $sessionStorage.eventoSelecionado;

	    		//$location.url('/');
	    		$("#menuLateral").show();
	    		$("#painelPrincipal").show();

	    		$scope.goToDashboard();

	    	}, function() {
	    		
	    		// TODO :  ir para tela de cadastro do evento
	    		$scope.status = 'You cancelled the dialog.';
	    	});
	  	};


	  	$scope.telaLogin = function() {

			$mdDialog.show({
	      		controller: LoginController,
	      		templateUrl: '/view/dialogs/login.tmpl.html',
	      		parent: angular.element(document.body),
	      		//targetEvent: ev,
	      		clickOutsideToClose:false,
	      		fullscreen: true // Only for -xs, -sm breakpoints.
	    	})
	    	.then(function(usuario) {
	    		$sessionStorage.usuarioLogado = usuario;

	    		$scope.goToDashboard();

	    	}, function() {
	    		// erro
	    	});
	  	};


	  	if(!loginService.isAuthenticated()){
	  		$scope.telaLogin();	
	  	} else {
	  		if(!$scope.evento){
	  		$scope.selecionarEvento();
	  	}
	  	}

		
	

		function LoginController($scope, $mdDialog, loginService) {

	  		$scope.usuario =null;
			$scope.senha   =null;
			$scope.msgErro =null;

			$scope.login = function(){

				if(!$scope.usuario || !$scope.senha) {
					$scope.msgErro = "Todos os campos são obrigatórios."; 
				} else {
					var cbErro =   $scope.novoEvento = function(msg) {
			     		$scope.msgErro = msg;
			    	};

				    var cbSucesso = function(usuario) {
				      $mdDialog.hide(usuario);
				    };

				    console.log('Senha md5: ',md5.createHash($scope.senha || ''));
					loginService.login($scope.usuario, md5.createHash($scope.senha || '') , $sessionStorage.dono, cbSucesso, cbErro);
				}
			};

		  };


	  	function DialogController($scope, $mdDialog, eventoService) {

	  		var getEventos = function(){
	  			eventoService.getEventos(function(resultado){
	  				console.log(resultado);
					$scope.eventos = resultado;

					if($scope.eventos && $scope.eventos.lenght == 1){
						$mdDialog.hide(eventos[0]);
					}
					
				});		
			};

			
		    $scope.novoEvento = function() {
		      $mdDialog.cancel();
		    };

		    $scope.selecionarEvento = function(evento) {
		      $mdDialog.hide(evento);
		    };

		    getEventos();
		  };

	}
);

