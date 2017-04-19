

eventoApp.controller('IngressoCadastroController',
	function ($scope, $http, $log, $mdDialog, $sessionStorage, ingressoService){
		var ingressoCtrl = this;
		ingressoCtrl.msg = '';
		ingressoCtrl.msgErro = '';

		$scope.tituloPagina = 'Novo Ingresso';
		ingressoCtrl.nomeCliente = null;
		ingressoCtrl.idCliente= null;
		ingressoCtrl.novoIngresso = {};
		ingressoCtrl.ingressos = [];

		var qtdIngressosPessoa = {};
		var dono = $sessionStorage.dono;
		ingressoCtrl.evento = $sessionStorage.eventoSelecionado;
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
			ingressoCtrl.nomeCliente = '';
			ingressoCtrl.idCliente = '';
			ingressoCtrl.ingressos = [];
			qtdIngressosPessoa = {};
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

			ingressoCtrl.msg = msg;
			ingressoCtrl.msgErro = '';
			$.notify({ message: msg },{ type: 'success', timer: 4000 });
		};


		var criarNovoIngresso = function(codigoIngresso, idConfiguracao){

			var config = recuperarConfiguracao(idConfiguracao);
			console.log('cofiguração para salvar', config);

			if(config && qtdIngressosPessoa >= config.quantidadeMaxPorPessoa){
				var msg = 'Limite máximo de '+config.quantidadeMaxPorPessoa+' ingressos por pessoa atingido. ';
				
				ingressoCtrl.msgErro = msg;
				$.notify({ message: msg },{ type: 'error', timer: 4000 });

			} else {
				var novoIngresso = {};
				novoIngresso.dono = dono;
				novoIngresso.idEvento = ingressoCtrl.evento._id;
				novoIngresso.nomeEvento = ingressoCtrl.evento.titulo;	
				novoIngresso.idCliente = ingressoCtrl.idCliente;
				novoIngresso.nomeCliente = ingressoCtrl.nomeCliente;
				novoIngresso.idConfiguracao = idConfiguracao;
				novoIngresso.chave = codigoIngresso;
				console.log('vai salvar ', novoIngresso);
    			ingressoService.novoIngresso(novoIngresso, callbackSucessoAdicionarIngresso);
			}
			
		};


		var callbackRemoverIngresso = function(idIngressoRemovido) {
			var msg = 'Ingresso removido com sucesso. ';
			
			var totalIngressos = qtdIngressosPessoa[ingressoGerado.idConfiguracao];
			if(!totalIngressos){
				totalIngressos = 0;
			} else {
				totalIngressos = totalIngressos-1;
			}
			qtdIngressosPessoa[ingressoGerado.idConfiguracao] = totalIngressos;
			
			if(ingressoCtrl.ingressos){
				var indiceRemover;
				for(i = 0; i < ingressoCtrl.ingressos.length; i++) { 
					if(ingressoCtrl.ingressos[i]._id  == idIngressoRemovido) {
						indiceRemover = i;
					}
				}
				alert('INdice remover '+indiceRemover);
				if(indiceRemover){
					ingressoCtrl.ingressos.splice(i, 1);
				}
			}

			ingressoCtrl.msg = msg;
			ingressoCtrl.msgErro = '';
			$.notify({ message: msg },{ type: 'success', timer: 4000 });
		};



		var removerIngresso = function(idIngresso){
			console.log('Remover ingresso ',idIngresso);
   			ingressoService.removerIngresso(idIngresso, callbackRemoverIngresso);
		};
		


		$scope.adicionarIngresso = function() {

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
	  	};


	  	monstarListaTiposIngressosDisponiveis(configuracoes);
		novoCadastro();



		function IngressoDialogController($scope, $mdDialog, $sessionStorage, ingressoService) {

			$scope.msgErro = null;
			$scope.codigoIngresso = null;
			$scope.idConfiguracao = null;

			$scope.selecionarTipoIngresso = false;

			var configuracoes = $sessionStorage.configuracoesEvento;
	  		
			if(configuracoes && configuracoes.length > 1){
				$scope.selecionarTipoIngresso = true;
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
		    		var dados = {'codigo' : $scope.idConfiguracao , 'idConfig':$scope.idConfiguracao}
		    		$mdDialog.hide(dados);	
		    	} else {
		    		if($scope.idConfiguracao){
		    			$scope.msgErro = "Você não inseriu o código do ingresso.";
		    		} else {
		    			$scope.msgErro = "Você não inseriu os dados necessários para geração do ingresso.";
		    		}
		    	}
	      	
		    };

		    $('#inputCodigoIngresso').focus();

		}


	}
);