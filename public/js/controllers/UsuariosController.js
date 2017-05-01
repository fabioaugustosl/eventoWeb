
eventoApp.controller('UsuariosController', 
	function ($scope, $routeParams, pessoaService){
		
		var pessoasCtrl = this;

		$scope.namePage = 'Clientes';

		var getPessoas = function(){
			pessoaService.listar(function(resultado){
				console.log('res: '+resultado);
				pessoasCtrl.pessoas = resultado;
			});		
		};


		getPessoas();

	}
	
);