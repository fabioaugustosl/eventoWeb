

eventoApp.controller('EventoCadastroController',
	function ($scope, $http, $log, $sessionStorage, eventoService, ingressoService){
		var eventoCtrl = this;
		eventoCtrl.msg = '';
		eventoCtrl.msgErro = '';

		$scope.tituloPagina = 'Evento';
		$scope.desabilitar = false;

		eventoCtrl.evento = {};
		eventoCtrl.configuracao = {};
		eventoCtrl.configuracao.preco = 0;

		eventoCtrl.configuracoes = $sessionStorage.configuracoesEvento;


		// eventoCtrl.configuracoes = [{tipoIngresso: 'Único', quantidadeTotal: 20}];

		var dono = $sessionStorage.dono;
		var eventoSelecionado = $sessionStorage.eventoSelecionado;

		$scope.tiposDeIngressos =  [
	      {id: 'Único', nome: 'Único'},
	      {id: 'Meia entrada', nome: 'Meia entrada'},
	      {id: 'VIP', nome: 'VIP'},
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


		
		$scope.adicionarConfig = function() {
			
			eventoCtrl.configuracao.idEvento = eventoSelecionado._id;

			if(!eventoCtrl.configuracoes){
				eventoCtrl.configuracoes = [];
			}

			eventoCtrl.configuracoes.push(eventoCtrl.configuracao);

			$.notify({message: "Configuração adicionada com sucesso. "  },{type: 'success',timer: 4000});

			eventoCtrl.configuracao	= {};
			eventoCtrl.configuracao.preco = 0;

		};


		$scope.removerConfig = function(config) {

			var i = eventoCtrl.configuracoes.indexOf(config);
			if(i != -1) {

				eventoCtrl.configuracoes.splice(i, 1);

				$.notify({message: "Configuração removida com sucesso. " },{type: 'success',timer: 4000});
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

				if(eventoCtrl.configuracoes){
					for (i = 0; i < eventoCtrl.configuracoes.length; i++){
						console.log('Vai salvar: ', eventoCtrl.configuracoes[i]);
						ingressoService.salvarConfiguracao(eventoCtrl.configuracoes[i], function(msg){ alert(msg);}, function(msg){alert(msg);});
					}
				}

			};

			var callbackErro = function(msg){
				eventoCtrl.msgErro = msg;
			};

			eventoService.salvar(eventoCtrl.evento, callbackSucesso, callbackErro);	

		};


		var recuperarEnderecoEvento = function(idEvento){
			eventoCtrl.endereco = {};  
			var callback = function(endereco){ 
				//alert(endereco);
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



		// init
		if(eventoSelecionado){
			eventoCtrl.evento = eventoSelecionado;

			recuperarEnderecoEvento(eventoSelecionado._id);
		
			if(!eventoCtrl.configuracoes){
				recuperarConfigEvento(eventoSelecionado._id);
			}

			recuperarQtdIngressos(eventoSelecionado._id);

		} else {
			$scope.novoEvento();
		}

	}
);
