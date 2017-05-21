
eventoApp.controller('UsuariosController', 
	function ($scope, $routeParams, pessoaService){
		
		var pessoasCtrl = this;

		$scope.pesquisa = {};

		$scope.namePage = 'Clientes';
		pessoasCtrl.processando = false;


		var getPessoas = function(parametros){
			processando = true;
			pessoaService.listar(parametros, function(resultado){
				console.log('res: '+resultado);
				processando = true;
				pessoasCtrl.pessoas = resultado;
			});		
		};


		$scope.pesquisar = function(){
				
			var p = '';
			if($scope.pesquisa.nome){
				p += 'nome='+$scope.pesquisa.nome;
			}
			if($scope.pesquisa.conta){
				if(p){
					p += '&';
				}
				p += 'info_extra3='+$scope.pesquisa.conta;
			}

			if(p){
				p = '?'+p;
			}

			console.log(p);
			getPessoas(p);
		};


		getPessoas();

	}
	
);