

eventoApp.controller('EventoCadastroController',
	function ($scope, $http, $log, $sessionStorage, $mdDialog, moment,  eventoService, ingressoService, relatorioIngressoService){
		
		var eventoCtrl = this;
		eventoCtrl.msg = '';
		eventoCtrl.msgErro = '';

		$scope.tituloPagina = 'Evento';
		$scope.desabilitar = false;

		eventoCtrl.evento = {};
		eventoCtrl.configuracao = {};
		eventoCtrl.configuracao.preco = 0;

		eventoCtrl.configuracoes = $sessionStorage.configuracoesEvento;


		var dono = $sessionStorage.dono;
		var eventoSelecionado = $sessionStorage.eventoSelecionado;

		eventoCtrl.ingressosDistribuidosPorConfig = null;
		eventoCtrl.idConfiguracaoAlterarQtd = null;

		$scope.tiposDeIngressos =  [
	      {id: 'Único', nome: 'Único'},
	      {id: 'Meia entrada', nome: 'Meia entrada'},
	      {id: 'VIP', nome: 'VIP'},
	      {id: 'Cortesia', nome: 'Cortesia'},
	      {id: 'Principal', nome: 'Principal'},
	      {id: 'Lote 1', nome: 'Lote 1'},
	      {id: 'Lote 2', nome: 'Lote 2'},
	      {id: 'Outro', nome: 'Outro'}
	    ];

		
		var enderecoEdicao = {};


		/*Verifica se alterou enderço ou nao.*/
		var alterouEndereco = function (){
			var retorno = false;
			if(eventoCtrl.endereco.logradouro && enderecoEdicao.logradouro != eventoCtrl.endereco.logradouro){
				retorno =true;
			} 
			if(eventoCtrl.endereco.numero && enderecoEdicao.numero != eventoCtrl.endereco.numero){
				retorno = true;
			}
			if(eventoCtrl.endereco.bairro && enderecoEdicao.bairro != eventoCtrl.endereco.bairro){
				retorno = true;
			}
			if(eventoCtrl.endereco.cidade && enderecoEdicao.cidade != eventoCtrl.endereco.cidade){
				retorno = true;
			}
			if(eventoCtrl.endereco.estado && enderecoEdicao.estado != eventoCtrl.endereco.estado){
				retorno = true;
			}
			return retorno;
		};



		$scope.novoEvento = function(){
			eventoCtrl.evento = {};
			eventoCtrl.evento.dono = dono;
		};


		
		var callbackAdicionarConfiguracao = function(configSalva){
			console.log('config persistida: ',configSalva);

			if(!eventoCtrl.configuracoes){
				eventoCtrl.configuracoes = [];
			}

			console.log('Configuracoes apos salvar: ', eventoCtrl.configuracoes);
			eventoCtrl.configuracoes.push(configSalva);
			$sessionStorage.configuracoesEvento = eventoCtrl.configuracoes;

			$.notify({message: "Configuração adicionada com sucesso. "  },{type: 'success',timer: 4000});

			eventoCtrl.configuracao	= {};
			eventoCtrl.configuracao.preco = 0;

		};


		var callbackErroConfiguracao = function(retorno){
			console.log('erro callback configuracao: ',retorno);
			$.notify({message: retorno  },{type: 'error',timer: 4000});
		};


		$scope.adicionarConfig = function() {
			console.log('vai add config');
			var configuracaoSalvar = eventoCtrl.configuracao;
		 	if(eventoCtrl.configuracao.dataInicioVendas){
				var d = moment(eventoCtrl.configuracao.dataInicioVendas, "DD/MM/YYY");
		 		configuracaoSalvar.dataInicioVendas = d.format("YYYY-MM-DD");
		 	}

		 	if(eventoCtrl.configuracao.dataTerminoVendas){
				var d1 = moment(eventoCtrl.configuracao.dataTerminoVendas, "DD/MM/YYY");
		 		configuracaoSalvar.dataTerminoVendas = d1.format("YYYY-MM-DD");
		 	}

		 	console.log(configuracaoSalvar);

		 	//if(eventoCtrl.quantidadeTotal > 0){
				configuracaoSalvar.idEvento = eventoSelecionado._id;
				ingressoService.salvarConfiguracao(configuracaoSalvar, callbackAdicionarConfiguracao, callbackErroConfiguracao);
			//}
		};


		var callbackRemoverConfiguracao = function(config){
			console.log('callback remover config: ',config);
			var i = eventoCtrl.configuracoes.indexOf(config);
			if(i != -1) {	

				eventoCtrl.configuracoes.splice(i, 1);
				$sessionStorage.configuracoesEvento = eventoCtrl.configuracoes;

				$.notify({message: "Configuração removida com sucesso. " },{type: 'success',timer: 4000});
			}
		};


		$scope.removerConfig = function(config) {
			console.log('vai remover: ', config);
			var qtd = eventoCtrl.ingressosDistribuidosPorConfig[config._id];
			
			console.log(' ha: ',qtd);

			

			if(qtd > 0){
				$.notify({message: "Não permitido a exclusão! Já foram distribuidos ingresso dessa categoria."  },{type: 'danger',timer: 40000});
			} else {
				var confirm = $mdDialog.confirm()
		          .title('Você tem certeza que deseja remover essa categoria de ingressos?')
		          .textContent('Verifique com cuidado se realmente deseja excluir a categoria '+config.tipoIngresso+'.')
		          .ariaLabel('Lucky day')
		         // .targetEvent(ev)
		          .ok('Sim')
		          .cancel('Não');

			    $mdDialog.show(confirm).then(function() {
			      ingressoService.removerConfiguracao(config, callbackRemoverConfiguracao, callbackErroConfiguracao);
			    }, function() {
			      //
			    });
			}

			
		};



		$scope.salvarConfiguracoes = function() {
			
			/*var callbackSucesso = function(msg){
				$.notify({
	            	message: msg
	            },{
	                type: 'success',
	                timer: 4000
	            });
			};

			var callbackErro = function(msg){
				$.notify({
	            	message: msg
	            },{
	                type: 'error',
	                timer: 4000
	            });
			};

			eventoCtrl.configuracao.idEvento = eventoSelecionado._id;

			ingressoService.salvarConfiguracao(eventoCtrl.configuracao, callbackSucesso, callbackErro);	*/
		};

		
		$scope.submit = function() {
			eventoCtrl.msg = '';
			eventoCtrl.msgEnd = '';
			eventoCtrl.msgErro = '';

			var callbackSucesso = function(msg){
				eventoCtrl.msg = msg;
				$.notify({ message: msg },{ type: 'success', timer: 4000 });

				if(alterouEndereco() == 1){
					eventoService.salvarEndereco(eventoCtrl.endereco, function(msg){ eventoCtrl.msgEnd = msg;}, callbackErro);	
				} 

				/*if(eventoCtrl.configuracoes){
					for (i = 0; i < eventoCtrl.configuracoes.length; i++){
						console.log('Vai salvar: ', eventoCtrl.configuracoes[i]);
						ingressoService.salvarConfiguracao(eventoCtrl.configuracoes[i], function(msg){ alert(msg);}, function(msg){alert(msg);});
					}
				}*/

			};

			var callbackErro = function(msg){
				eventoCtrl.msgErro = msg;
			};

			eventoService.salvar(eventoCtrl.evento, callbackSucesso, callbackErro);	

		};


		var recuperarEnderecoEvento = function(idEvento){
			console.log('vai recuperar o endereco');
			eventoCtrl.endereco = {};  
			var callback = function(endereco){ 
				console.log('recuperou: ',endereco);
				enderecoEdicao = endereco;  
				eventoCtrl.endereco = endereco;  
			};

			eventoService.getEndereco(idEvento, callback);
		};


		var recuperarConfigEvento = function(idEvento){
			eventoCtrl.configuracoes = [];  
			var callback = function(configs){ 
			if(configs){
					eventoCtrl.configuracoes = configs;  
					console.log('Recuperou as configuracoes: ',eventoCtrl.configuracoes);
				} 
			};

			ingressoService.getConfiguracoes(idEvento, callback);
		};



		var recuperarQtdIngressos = function(idEvento){
			
			var callback = function(qtd){ 

				if(qtd > 0){
					$scope.desabilitar = true;
				} 
			};

			ingressoService.getTotalIngressosEvento(idEvento, callback);
		};


		
		var callbackDistrubuicaoIngressosPorConfig = function(dados){
		 	eventoCtrl.ingressosDistribuidosPorConfig = {};

		 	if(dados && dados.length > 0){

			 	for (i = 0; i < dados.length; i++) { 
		        	var dado = dados[i];

		        	if(dado._id){
		        		eventoCtrl.ingressosDistribuidosPorConfig[dado._id] = dado.total;
		        	}
		        }
		    }

		    console.log('distribuicao dos ingressos por categoria: ', eventoCtrl.ingressosDistribuidosPorConfig);

	    };


	    var loadDistrubuicaoIngressosPorConfig = function(){
	    	relatorioIngressoService.getDistribuicaoIngressosPorConfiguracao(callbackDistrubuicaoIngressosPorConfig);
	    };




		// init
		if(eventoSelecionado){
			eventoCtrl.evento = eventoSelecionado;

			console.log('eventoooo: ',eventoCtrl.evento);

			recuperarEnderecoEvento(eventoSelecionado._id);
		
			//if(!eventoCtrl.configuracoes){
				recuperarConfigEvento(eventoSelecionado._id);
		//	}

			recuperarQtdIngressos(eventoSelecionado._id);

			loadDistrubuicaoIngressosPorConfig();

		} else {
			$scope.novoEvento();
		}






		$scope.alterarQtdIngresso = function(idConfig) {
			eventoCtrl.idConfiguracaoAlterarQtd = idConfig;

			$mdDialog.show({
	      		controller: AlterarQtdIngressosDialogController,
	      		templateUrl: '/view/dialogs/alterarQtdMaxIngrassoConfiguracao.tmpl.html',
	      		parent: angular.element(document.body),
	      		//targetEvent: ev,
	      		clickOutsideToClose:true,
	      		fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
	    	})
	    	.then(function(qtd) {
	    		console.log('quantidade: ', qtd);
	    		
	    		var fcCallbackSucesso = function(configSalva){
					$.notify({message: "Quantidade de ingressos alterada com sucesso. "  },{type: 'success',timer: 4000});
				};

	    		var configSalvar = null;
	    		for (i = 0; i < eventoCtrl.configuracoes.length; i++){
					var c =  eventoCtrl.configuracoes[i];
					if(eventoCtrl.idConfiguracaoAlterarQtd == c._id){
						c.quantidadeTotal = qtd;
						configSalvar = c;
					}
				}
				if(configSalvar){
					ingressoService.salvarConfiguracao(configSalvar, fcCallbackSucesso, callbackErroConfiguracao );
				}

				eventoCtrl.idConfiguracaoAlterarQtd = null;



	    	//	criarNovoIngresso(dados.codigo, dados.idConfig);

	    	}, function() {
	    		// TODO :  executar alguma ação ao cancelar
	    		eventoCtrl.idConfiguracaoAlterarQtd = null;
	    	});
	  	};


		function AlterarQtdIngressosDialogController($scope, $mdDialog) {

			$scope.msgErro = null;
			$scope.qtdMaximoIngresso = null;

		
			var qtd = eventoCtrl.ingressosDistribuidosPorConfig[eventoCtrl.idConfiguracaoAlterarQtd];
			if(!qtd){
				qtd = 0;
			}

			$scope.qtdMinino = qtd;
			$scope.qtdMaximoIngresso = $scope.qtdMinino;

				
		    $scope.cancelar = function() {
		    	$scope.qtdMaximoIngresso = '';
		    	$scope.msgErro = '';
		      	$mdDialog.cancel();
		    };

		    $scope.alterar = function() {
		    	if($scope.qtdMaximoIngresso){
		    		if($scope.qtdMaximoIngresso < $scope.qtdMinino){
						$scope.msgErro = "A quantidade não pode ser inferior a "+$scope.qtdMinino;
		    		} else {
		    			$mdDialog.hide($scope.qtdMaximoIngresso);		
		    		}
		    	} else {
		    		$scope.msgErro = "Você não inseriu a nova quantidade.";
		    	}
		    };


		};


	}
);

