
eventoApp.controller('UsuariosController', 
	function ($scope, $location, $routeParams, pessoaService){
		
		var pessoasCtrl = this;

		$scope.pesquisa = {};

		$scope.namePage = 'Clientes';
		pessoasCtrl.processando = false;


		var getPessoas = function(parametros){
			pessoasCtrl.processando = true;
			pessoaService.listar(parametros, function(resultado){
				console.log('res: '+resultado);
				pessoasCtrl.pessoas = resultado;
				pessoasCtrl.processando  = false;
			});		
		};


		pessoasCtrl.cadastrar = function(){
			console.log('vai pro cad');
			$location.replace();
			$location.url('/cadastrarPessoa');
			$scope.tituloPagina = 'Cadastrar Pessoa';	
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