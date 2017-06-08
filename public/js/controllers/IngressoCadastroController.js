

eventoApp.controller('IngressoCadastroController',
	function ($scope, $http, $log, $mdDialog, $sessionStorage, ingressoService, pessoaService){
		
		var ingressoCtrl = this;
		ingressoCtrl.msg = '';
		ingressoCtrl.msgErro = '';

		ingressoCtrl.documentoPrincipal = '';  /// poderá ser cpf ou cnpj

		$scope.tituloPagina = 'Novo Ingresso';
		//ingressoCtrl.nomeCliente = null;
		//ingressoCtrl.idCliente= null;
		ingressoCtrl.novoIngresso = {};
		ingressoCtrl.ingressos = [];

		ingressoCtrl.desabilitarCadPessoa = false;
		ingressoCtrl.processando = false;

		var qtdIngressosPessoa = {};
		var dono = $sessionStorage.dono;
		ingressoCtrl.evento = $sessionStorage.eventoSelecionado;
		var configuracoes = $sessionStorage.configuracoesEvento;


		var categoriaIngressoPadraoParaCliente = null;


	    var recuperarConfiguracao = function(idConfiguracao){
	    	var config = null ;
	    	if(configuracoes){
				for (i = 0; i < configuracoes.length; i++) { 
			    	var c =  configuracoes[i];
			    	if(idConfiguracao == c._id){
			    		config = c;
			    	}
				}
	    	}
	    	return config;
	    };


		var novoCadastro = function(){
			ingressoCtrl.novoIngresso = {};
			ingressoCtrl.novoIngresso.dono = dono;
			ingressoCtrl.novoIngresso.idEvento = ingressoCtrl.evento._id;
			ingressoCtrl.novoIngresso.nomeEvento = ingressoCtrl.evento.titulo;	
			ingressoCtrl.novoIngresso.idCliente = null;

			ingressoCtrl.novoIngresso.nomeCliente = '';
			ingressoCtrl.novoIngresso.docCliente1 = null;
			ingressoCtrl.novoIngresso.docCliente2 = null;
			ingressoCtrl.novoIngresso.docCliente3 = null;

		};


		$scope.limparNomeAcompanhante = function(){
			if(!ingressoCtrl.novoIngresso.docCliente2){
				ingressoCtrl.novoIngresso.acompanhante= null;	
			}
			
		};


		$scope.iniciarCadastro = function(){
			ingressoCtrl.msg = '';
			ingressoCtrl.msgErro = '';
			ingressoCtrl.msgPessoaEncontrada = '';

			novoCadastro();
			
			ingressoCtrl.ingressos = [];
			qtdIngressosPessoa = {};
			ingressoCtrl.documentoPrincipal = 'CPF'; 

			ingressoCtrl.desabilitarCadPessoa = true; // depois isso deve ser configurável. Exemplo: se puder cadastrar a pessoa na hora deve ser false. Se for apenas pessoas cadastradas true.
		};


		$scope.trocarDocumento = function(nomeDoc) {
			ingressoCtrl.documentoPrincipal = nomeDoc;
			novoCadastro();
	  	};


		var callbackSucessoAdicionarIngresso  = function(ingressoGerado) {
			var msg = 'Ingresso gerado com sucesso. ';
			
			var totalIngressos = qtdIngressosPessoa[ingressoGerado.idConfiguracao];
			if(!totalIngressos){
				totalIngressos = 1;
			} else {
				totalIngressos = totalIngressos+1;
			}
			qtdIngressosPessoa[ingressoGerado.idConfiguracao] = totalIngressos;
			
			ingressoCtrl.ingressos.push(ingressoGerado);

			novoCadastro();

			ingressoCtrl.novoIngresso.nomeCliente = ingressoGerado.nomeCliente;
			ingressoCtrl.novoIngresso.docCliente1 = ingressoGerado.docCliente1;
			ingressoCtrl.novoIngresso.docCliente2 = ingressoGerado.docCliente2;
			ingressoCtrl.novoIngresso.docCliente3 = ingressoGerado.docCliente3;

			ingressoCtrl.msg = msg;
			ingressoCtrl.msgErro = '';
			$.notify({ message: msg },{ type: 'success', timer: 4000 });
		};


		var callbackErroAdicionarIngresso  = function(msg) {
			ingressoCtrl.msg = '';
			ingressoCtrl.msgErro = msg;
			$.notify({ message: msg },{ type: 'danger', timer: 4000 });
		};


		var criarNovoIngresso = function(codigoIngresso, idConfiguracao){

			var config = recuperarConfiguracao(idConfiguracao);
			console.log('cofiguração para salvar', config);

			if(config && qtdIngressosPessoa >= config.quantidadeMaxPorPessoa){
				var msg = 'Limite máximo de '+config.quantidadeMaxPorPessoa+' ingressos por pessoa atingido. ';
				
				ingressoCtrl.msgErro = msg;
				$.notify({ message: msg },{ type: 'danger', timer: 4000 });

			} else {
				if(ingressoCtrl.novoIngresso.docCliente1){
					ingressoCtrl.novoIngresso.idCliente = ingressoCtrl.novoIngresso.docCliente1;	
				} else {
					ingressoCtrl.novoIngresso.idCliente = ingressoCtrl.novoIngresso.nomeCliente;	
				}
				
				ingressoCtrl.novoIngresso.idConfiguracao = idConfiguracao;
				ingressoCtrl.novoIngresso.chave = codigoIngresso;
				console.log('vai salvar ', ingressoCtrl.novoIngresso);
    			ingressoService.novoIngresso(ingressoCtrl.novoIngresso, callbackSucessoAdicionarIngresso, callbackErroAdicionarIngresso);
			}
			
		};


		/*
 		 * Esse método é bem especifico para credifor. No caso dessa parada virar um produto esse método 
 		 * deve ser refeito ou ir pro espaço.
		 */
		var recuperarConfiguracaoPadraoPorCategoriaIngresso = function(perfil){
			console.log('perfil '+perfil);
			console.log('congiguracoes: ',configuracoes);
			var conf = null ;
			if(perfil){
		    	
		    	if(configuracoes){
					for (i = 0; i < configuracoes.length; i++) { 
						var c =  configuracoes[i];
						console.log(c);
						if(c.perfilPadrao){
							for (j = 0; j < c.perfilPadrao.length; j++) {
								var p = c.perfilPadrao[j];
								if(p == perfil){
									conf = c;
									break;
								}
							}
						}
					}
		    	}
		    }
		    console.log('vai retornar essa config: ',conf);
		    return conf;
	    };


		var callbackRecuperarCliente = function(pessoa) {

			console.log('pessoa recuperada: ', pessoa);

			if(pessoa && pessoa.length > 0){
				ingressoCtrl.novoIngresso.nomeCliente = pessoa[0].nome;

				// documento_extra1 é onde está salvo o cnpj no PessoaAPI
				if(ingressoCtrl.documentoPrincipal != 'CPF'){
					// cpf do responsavel	
					if(pessoa[0].cpf){
						ingressoCtrl.novoIngresso.docCliente2 = pessoa[0].cpf;	
					} else {
						ingressoCtrl.novoIngresso.docCliente2 = "";	
					}

					// nome do responsavel
					if(pessoa[0].info_extra2){
						ingressoCtrl.novoIngresso.acompanhante = pessoa[0].info_extra2;	
					} else {
						ingressoCtrl.novoIngresso.acompanhante = "";	
					}
 
				} 

				ingressoCtrl.novoIngresso.docCliente3 = pessoa[0].info_extra3;	

				//ingressoCtrl.novoIngresso.docCliente2 = pessoa[0].rg;

				ingressoCtrl.desabilitarCadPessoa = true;
				categoriaIngressoPadraoParaCliente = null;

				//if(pessoa[0].info_extra1){
					
					var categPadrao = recuperarConfiguracaoPadraoPorCategoriaIngresso(pessoa[0].info_extra1);
					console.log('chegou categ ',categPadrao);
					if(categPadrao){
						categoriaIngressoPadraoParaCliente = categPadrao._id;
					}
				//}

				ingressoCtrl.msgPessoaEncontrada = "Tipo da conta: "+pessoa[0].info_extra1;
				
			} else {
				ingressoCtrl.msgPessoaEncontrada = "Pessoa não identificada em na base de dados.";
				// CASO NAO HAJA A TRAVA DE ENTREGAR INGRESSOS APENAS PARA CADASTRADOS ISSO DEVE SER DESCOMENTADO
				//ingressoCtrl.desabilitarCadPessoa = false;
				ingressoCtrl.novoIngresso.nomeCliente = '';
				ingressoCtrl.novoIngresso.docCliente1 = '';
				ingressoCtrl.novoIngresso.docCliente2 = '';
				categoriaIngressoPadraoParaCliente = null;
			}

			ingressoCtrl.processando = false;
		};


		$scope.recuperarCliente = function(){
			console.log('Vai recuperar o cliente',ingressoCtrl.novoIngresso.docCliente1);

			if(ingressoCtrl.novoIngresso.docCliente1){
				ingressoCtrl.msgPessoaEncontrada = "";
				ingressoCtrl.processando = true;

				if(ingressoCtrl.documentoPrincipal == 'CPF'){
					pessoaService.recuperarPessoaPorCpf(ingressoCtrl.novoIngresso.docCliente1, callbackRecuperarCliente);	
				}else {
					pessoaService.recuperarPessoaPorCnpj(ingressoCtrl.novoIngresso.docCliente1, callbackRecuperarCliente);	
				}
			}
			  			
		};


		var callbackRemoverIngresso = function(idIngressoRemovido, idConfiguracao) {
			var msg = 'Ingresso removido com sucesso. ';
			

			console.log('ingressos antes: ', ingressoCtrl.ingressos);

			var totalIngressos = qtdIngressosPessoa[idConfiguracao];
			if(!totalIngressos){
				totalIngressos = 0;
			} else {
				totalIngressos = totalIngressos-1;
			}
			qtdIngressosPessoa[idConfiguracao] = totalIngressos;
			
			if(ingressoCtrl.ingressos){
				var indiceRemover;
				for(i = 0; i < ingressoCtrl.ingressos.length; i++) { 
					if(ingressoCtrl.ingressos[i]._id  == idIngressoRemovido) {
						indiceRemover = i;
					}
				}
				console.log('Indice remover '+indiceRemover);
				if(indiceRemover >= 0){
					ingressoCtrl.ingressos.splice(indiceRemover, 1);
				}
			}


			console.log('depois : ',ingressoCtrl.ingressos);
			ingressoCtrl.msg = msg;
			ingressoCtrl.msgErro = '';
			$.notify({ message: msg },{ type: 'success', timer: 4000 });
		};



		$scope.removerIngresso = function(idIngresso, idConfiguracao){
			console.log('Remover ingresso ',idIngresso);
			var confirm = $mdDialog.confirm()
	          .title('Você tem certeza que deseja remover o ingresso desta pessoa?')
	          .textContent('Caso o ingresso esteja impresso favor conferir se o mesmo foi devolvido.')
	          .ariaLabel('Lucky day')
	         // .targetEvent(ev)
	          .ok('Sim')
	          .cancel('Não');

		    $mdDialog.show(confirm).then(function() {
		      ingressoService.removerIngresso(idIngresso, idConfiguracao, callbackRemoverIngresso);
		    }, function() {
		      //
		    });   			
		};
		


		$scope.adicionarIngresso = function() {
			ingressoCtrl.msgErro = "";
			if(ingressoCtrl.documentoPrincipal != 'CPF' &&
						!ingressoCtrl.novoIngresso.docCliente2){
				ingressoCtrl.msgErro = "Favor preencher o CPF do Responsável";
				$.notify({ message: "Favor preencher o CPF do Responsável" },{ type: 'danger', timer: 3000 });
			} else{
				$mdDialog.show({
		      		controller: IngressoDialogController,
		      		templateUrl: '/view/dialogs/adicionarIngresso.tmpl.html',
		      		parent: angular.element(document.body),
		      		//targetEvent: ev,
		      		clickOutsideToClose:true,
		      		fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
		    	})
		    	.then(function(dados) {
		    		console.log('id config: ', dados);
		    		criarNovoIngresso(dados.codigo, dados.idConfig);

		    	}, function() {
		    		// TODO :  executar alguma ação ao cancelar
		    	});	
			}
			
	  	};


	  	//monstarListaTiposIngressosDisponiveis(configuracoes);
		$scope.iniciarCadastro();





		function IngressoDialogController($scope, $mdDialog, $sessionStorage, ingressoService) {

			$scope.msgErro = null;
			$scope.codigoIngresso = null;
			$scope.idConfiguracao = null;

			$scope.selecionarTipoIngresso = false;

			var configuracoes = $sessionStorage.configuracoesEvento;

			$scope.tiposDeIngressos =  [];

		    var monstarListaTiposIngressosDisponiveis = function(configuracoes){
		    	$scope.tiposDeIngressos =  [];

		    	if(configuracoes){
					for (i = 0; i < configuracoes.length; i++) { 
				    	var c =  configuracoes[i];
				    	$scope.tiposDeIngressos.push({id: c._id, nome: c.tipoIngresso});
					}
		    	}
		    };

	  		
			if(configuracoes && configuracoes.length > 1){
				
				console.log('categoriaIngressoPadraoParaCliente : '+categoriaIngressoPadraoParaCliente );
				if(categoriaIngressoPadraoParaCliente){
					$scope.idConfiguracao = categoriaIngressoPadraoParaCliente;
				} else {
					$scope.selecionarTipoIngresso = true;
				}

			} else {
				$scope.idConfiguracao = configuracoes[0]._id;
			}
				
		    $scope.cancelar = function() {
		    	$scope.codigoIngresso = '';
		    	$scope.msgErro = '';
		      	$mdDialog.cancel();
		    };

		    $scope.adicionar = function() {
		    	if($scope.codigoIngresso && $scope.idConfiguracao){
		    		var dados = {'codigo' : $scope.codigoIngresso , 'idConfig':$scope.idConfiguracao};

		    		var fcCallbackSim = function(){
		    			$mdDialog.hide(dados);	
		    		};

		    		var fdCallbackNao = function(){
		    			$scope.msgErro = "O código do ingresso não é válido. Favor conferir o número impresso no ingresso.";
		    		};

		    		ingressoService.codigoIngressoEhValido($sessionStorage.dono, 
		    										$sessionStorage.eventoSelecionado._id, 
		    										$scope.codigoIngresso, 
		    										fcCallbackSim, 
		    										fdCallbackNao);

		    	} else {
		    		if($scope.idConfiguracao){
		    			$scope.msgErro = "Você não inseriu o código do ingresso.";
		    		} else {
		    			$scope.msgErro = "Você não inseriu os dados necessários para geração do ingresso.";
		    		}
		    	}
	      	
		    };

			monstarListaTiposIngressosDisponiveis(configuracoes);
		    //$('#inputCodigoIngresso').focus();

		}


	}
);
