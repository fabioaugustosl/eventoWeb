

eventoApp.controller('DashboardController',
	function ($scope, $http, $log, $sessionStorage, moment, ingressoService){
		
		$scope.namePage = 'Dashboard';

		var dono = $sessionStorage.dono;
		var eventoSelecionado = $sessionStorage.eventoSelecionado;

		var configuracoes = $sessionStorage.configuracoesEvento;

		//$scope.resumeData = statsService.resumeData;

		$scope.resumeData = [
			{
				name : 'Ingressos',
				classImg : 'ti-server',
				classImgStatus : 'icon-warning',
				value : '1045',
				infoUpdate : 'Atualizado agora',
				classIcon: 'ti-reload'
			},
			{
				name : 'Arrecadação',
				classImg : 'ti-wallet',
				classImgStatus : 'icon-success',
				value : 'R$1,345',
				infoUpdate : 'Ultimo dia',
				classIcon: 'ti-calendar'
			}
			/*,
			{
				name : 'Reclamações',
				classImg : 'ti-pulse',
				classImgStatus : 'icon-danger',
				value : '23',
				infoUpdate : 'No último dia',
				classIcon: 'ti-timer'
			}*/
		];

		

		var gerarEstatisticasConfiguracao = function(config){

			var total = 0;

			for (i = 0; i < config.length; i++) { 

		    	var c =  config[i];
		    	if(c.quantidadeTotal){
		    		total += c.quantidadeTotal;
		    	}
			}

			$scope.resumeData.push(
				{
					name : 'Total Ingressos',
					classImg : 'ti-ticket',
					classImgStatus : 'icon-warning',
					value : total,
					infoUpdate : moment().format('MMMM D YYYY, hh:mm'),
					classIcon: 'ti-reload'
				}
			);

		};


	

		var recuperarConfiguracaoEvento = function(idEvento){
			
			var callback = function(config){ 
				alert('call back Dashboard config');
				console.log('Vai setar o config no storage',config);
				$sessionStorage.configuracoesEvento = config;
				gerarEstatisticasConfiguracao(config);
			};

			ingressoService.getConfiguracoes(idEvento, callback);
		};


		var recuperarQtdIngressos = function(idEvento){
			
			var callback = function(qtd){ 
				/*alert('call back '+ qtd);
				if(!qtd){
					qtd = 0;
				}*/

				$scope.resumeData.push(
					{
						name : 'Ingressos Distruidos',
						classImg : 'ti-ticket',
						classImgStatus : 'icon-warning',
						value : qtd,
						infoUpdate : moment().format('MMMM D YYYY, hh:mm'),
						classIcon: 'ti-reload'
					}
				);

				
			};

			ingressoService.getTotalIngressosEvento(idEvento, callback);
		};



		if(eventoSelecionado){
			if(configuracoes){
				gerarEstatisticasConfiguracao(configuracoes);
			} else {
				recuperarConfiguracaoEvento(eventoSelecionado._id);
			}
			
			recuperarQtdIngressos(eventoSelecionado._id);
		}
		

	}
);
