
eventoApp.controller('CadastrarPessoaController', 
	function ($scope, $location, $routeParams, $sessionStorage, pessoaService){
		
		var pessoaCtrl = this;

		var dono = $sessionStorage.dono;

		$scope.namePage = 'Cadastrar Pessoa';
		pessoaCtrl.processando = false;

		pessoaCtrl.msg = '';
		pessoaCtrl.msgErro = '';


		pessoaCtrl.tipos = ['PF', 'PJ'];

		var iniciarPessoa = function(){
			pessoaCtrl.pessoa = {};
			pessoaCtrl.pessoa.dono = dono;
			pessoaCtrl.pessoa.info_extra1 = 'PF';

		};

		iniciarPessoa();


		

		
		var callbackSalvar = function(resultado){
			console.log("call back salvar", resultado);
			
			/*if(!pessoaCtrl.editando){
				pessoaCtrl.pessoas.push(resultado);
			}*/
			pessoaCtrl.editando = false;

			pessoaCtrl.processando  = false;
			pessoaCtrl.msg = "A pessoa foi salva com sucesso";
			pessoaCtrl.msgErro = '';
			iniciarPessoa();
		};

		var callbackSalvarErro= function(resultado){
			pessoaCtrl.processando  = false;
			pessoaCtrl.msg = "";
			pessoaCtrl.msgErro = 'Ocorreu um erro ao salvar a pessoa';
			notificarErro(pessoaCtrl.msgErro);
		};

		pessoaCtrl.salvar = function(){
			console.log('vai cadastrar: ',pessoaCtrl.pessoa);
			pessoaCtrl.processando = true;
				
			pessoaService.salvar(pessoaCtrl.pessoa, callbackSalvar, callbackSalvarErro);		
		};


		pessoaCtrl.voltar = function(){
			$location.replace();
			$location.url('/user');
			$scope.tituloPagina = 'Clientes';	
		};


	}
	
);