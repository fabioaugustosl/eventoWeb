
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

		
		var preencheZerosEsquerda =  function (texto,tamanho)  {  
		    var contador = texto.length;  
		      
		    if (texto.length != tamanho)  {  
		         while (contador < tamanho)  {  
		            texto = "0" + texto;  
		            contador += 1;  
		        }
		    }  
		    return texto;
		}; 

		pessoaCtrl.salvar = function(){
			if(pessoaCtrl.pessoa.info_extra1 == "PF"){
				pessoaCtrl.pessoa.cpf = preencheZerosEsquerda(pessoaCtrl.pessoa.cpf,11);
			} else {
				pessoaCtrl.pessoa.documento_extra1 = preencheZerosEsquerda(pessoaCtrl.pessoa.documento_extra1,14);
			}
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