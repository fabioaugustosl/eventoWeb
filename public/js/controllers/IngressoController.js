

eventoApp.controller('IngressoController',
	function ($scope, $mdDialog, $sessionStorage, ingressoService, logService){
		
		$scope.tituloPagina = 'Ingressos';
		$scope.nomeEvento = $sessionStorage.eventoSelecionado.titulo;
		$scope.msg = null;
		$scope.msgErro = null;

		$scope.processando = false;

		$scope.pesquisa = {};
		//$scope.pesquisa.nome = '';
		//$scope.pesquisa.chave = '';
		
		var getIngressos = function(parametros){
			$scope.processando = true;
			ingressoService.getIngressos(parametros, function(resultado){
				//console.log('res: '+resultado);
				$scope.ingressos = resultado;
				$scope.processando = false;
			});		
		};


		$scope.pesquisar = function(){
			
			$scope.processando = true;	
			var p = '';
				if($scope.pesquisa.nome){
					p += 'nomeCliente='+$scope.pesquisa.nome;
				}
				if($scope.pesquisa.chave){
					if(p){
						p += '&';
					}
					p += 'chave='+$scope.pesquisa.chave;
				}

			if(p){
				p = '?'+p;
			}

			//console.log(p);
			getIngressos(p);
		};


		$scope.exportar = function(){
			
			$scope.processando = true;	

			console.log('id evento: ',$sessionStorage.eventoSelecionado);

			ingressoService.exportarIngressos($sessionStorage.eventoSelecionado.id, 
					function(data){
						$scope.processando = false;
					});
			
		};




		var callbackRemoverIngresso = function(idIngressoRemovido, idConfiguracao) {
			var msg = 'Devolução de ingresso realizada com sucesso. ';
			
			if($scope.ingressos){
				var indiceRemover;
				for(i = 0; i < $scope.ingressos.length; i++) { 
					if($scope.ingressos[i]._id  == idIngressoRemovido) {
						indiceRemover = i;

					}
				}
				//console.log('Indice remover '+indiceRemover);
				if(indiceRemover >= 0){
					$scope.ingressos.splice(indiceRemover, 1);
				}
			}

			logService.novo('DEVOLUCAO_INGRESSO', $sessionStorage.eventoSelecionado._id, 'Devolução do ingresso. Id do ingresso: '+idIngressoRemovido);

			$scope.processando = false;

			$scope.msg = msg;
			$scope.msgErro = '';
			$.notify({ message: msg },{ type: 'success', timer: 4000 });
		};


		$scope.removerIngresso = function(idIngresso){

			//console.log('Remover ingresso ',idIngresso);
			$scope.msg = '';
			$scope.msgErro = '';

			var confirm = $mdDialog.prompt()
	          .title('Deseja realmente confirmar a devolução do ingresso?')
	          .textContent('Favor inserir uma justificativa:')
	          .placeholder('Justificar devolução')
		      .ariaLabel('justificativa')
		      .initialValue('')
	         // .targetEvent(ev)
	          .ok('Sim')
	          .cancel('Não');

		    $mdDialog.show(confirm).then(function() {
		    	$scope.processando = true;
		      ingressoService.removerIngresso(idIngresso, null,  callbackRemoverIngresso);
		    }, function() {
		      $scope.processando = false;
		    });   			
		};


		getIngressos('');

	}
);

