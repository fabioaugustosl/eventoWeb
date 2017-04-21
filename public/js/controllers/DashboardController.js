

eventoApp.controller('DashboardController',
	function ($scope, $http, $log, $sessionStorage, moment, ingressoService, relatorioIngressoService){
		
		$scope.namePage = 'Dashboard';
		$scope.atualizacaoGraficoDistribuicaoDia = null;
		$scope.atualizacaoGraficoIngressoPorCategoria = null;
		$scope.atualizacaoGraficoDistrubuicaoPorCategoria = null;

		var dono = $sessionStorage.dono;
		var eventoSelecionado = $sessionStorage.eventoSelecionado;

		var configuracoes = $sessionStorage.configuracoesEvento;

		//$scope.resumeData = statsService.resumeData;

		$scope.resumeData = [
			/*{
				name : 'Ingressos',
				classImg : 'ti-server',
				classImgStatus : 'icon-warning',
				value : '1045',
				infoUpdate : 'Atualizado agora',
				classIcon: 'ti-reload'
			}*//*,
			{
				name : 'Arrecadação',
				classImg : 'ti-wallet',
				classImgStatus : 'icon-success',
				value : 'R$1,345',
				infoUpdate : 'Ultimo dia',
				classIcon: 'ti-calendar'
			}*/
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
					infoUpdate : moment().format('D MMMM YYYY, hh:mm'),
					classIcon: 'ti-reload'
				}
			);

		};


	

		var recuperarConfiguracaoEvento = function(idEvento){
			
			var callback = function(config){ 
				//alert('call back Dashboard config');
				console.log('Vai setar o config no storage',config);
				$sessionStorage.configuracoesEvento = config;
				configuracoes = config;
				gerarEstatisticasConfiguracao(config);
				loadGraficoIngressosPorCategoria(config);
			};

			ingressoService.getConfiguracoes(idEvento, callback);
		};


		var recuperarQtdIngressos = function(idEvento){
			
			var callback = function(qtd){ 
				$scope.resumeData.push(
					{
						name : 'Ingressos Distruidos',
						classImg : 'ti-ticket',
						classImgStatus : 'icon-success',
						value : qtd,
						infoUpdate : moment().format('D MMMM YYYY, hh:mm'),
						classIcon: 'ti-reload'
					}
				);


				
				var total = 0;
				for (i = 0; i < configuracoes.length; i++) { 
			    	var c =  configuracoes[i];
			    	if(c.quantidadeTotal){
			    		total += c.quantidadeTotal;
			    	}
				}

				$scope.resumeData.push(
					{
						name : 'Ingressos Restantes',
						classImg : 'ti-ticket',
						classImgStatus : 'icon-error',
						value : (total - qtd),
						infoUpdate : moment().format('D MMMM YYYY, hh:mm'),
						classIcon: 'ti-reload'
					}
				);
			};

			ingressoService.getTotalIngressosEvento(idEvento, callback);
		};




		// funções graficos
		var callbackGraficoDistrubuicaoIngressos = function(dados){

		 	console.log('chegou no callback distrubuicao ingresso por dia ',dados);

		 	if(dados && dados.length > 0){
				$scope.atualizacaoGraficoDistribuicaoDia =  moment().format('D MMMM YYYY, hh:mm');

			 	var rotulos = [];
		        var serieX = [];

		        for (i = 0; i < dados.length; i++) { 
		        	var dado = dados[i];
		        	
		        	rotulos.push(dado._id.day+'/'+dado._id.month);

		        	serieX.push(dado.count);
		        }

		        var dadoDistribuicao = {
		          labels: rotulos,
		          series: [serieX]
		        };

		        console.log('obj grafico distrubuicao ingressos: ', dadoDistribuicao);

		        var options = {
				  seriesBarDistance: 10
				};

				var responsiveOptions = [
				  ['screen and (max-width: 640px)', {
				    seriesBarDistance: 5,
				    axisX: {
				      labelInterpolationFnc: function (value) {
				        return value[0];
				      }
				    }
				  }]
				];

		        Chartist.Line('#graficoDistribuicaoDia', dadoDistribuicao, options, responsiveOptions);
		    }

	    };


	    var loadGraficoDistrubuicaoIngressos = function(){
	    	relatorioIngressoService.getDistribuicaoIngressosPorDia(callbackGraficoDistrubuicaoIngressos);
	    };


	    var recuperarConfiguracaoPorId = function(idConfig){
	    	for (i = 0; i < configuracoes.length; i++) { 
		    	var c =  configuracoes[i];
		    	if(idConfig == c._id){
		    		return c;
		    	}
			}
	    };


		var callbackGraficoDistrubuicaoIngressosCategoria = function(dados){

		 	console.log('chegou no callback dados ingressos por categoria',dados);

		 	if(dados && dados.length > 0){
				$scope.atualizacaoGraficoDistrubuicaoPorCategoria =  moment().format('D MMMM YYYY, hh:mm');

			 	var rotulos = [];
		        var serieVendidos = [];
		        var serieTotal = [];

		        for (i = 0; i < dados.length; i++) { 
		        	var dado = dados[i];

		        	if(dado._id){
		        		var conf = null;//recuperarConfiguracaoPorId(dado._id);
		        		for (i = 0; i < configuracoes.length; i++) { 
					    	var c =  configuracoes[i];
					    	if(dado._id == c._id){
					    		conf = c;
					    	}
						}
		        		rotulos.push(conf.tipoIngresso);
		        		serieTotal.push(conf.quantidadeTotal);
		        		serieVendidos.push(dado.total);	
		        	}
		        }

		        var dadoDistribuicao = {
		          labels: rotulos,
		          series: [serieTotal, serieVendidos]
		        };

		        var options = {
				  seriesBarDistance: 10
				};

				var responsiveOptions = [
				  ['screen and (max-width: 640px)', {
				    seriesBarDistance: 5,
				    axisX: {
				      labelInterpolationFnc: function (value) {
				        return value[0];
				      }
				    }
				  }]
				];

		        Chartist.Bar('#graficoDistribuicaoPorCategoria', dadoDistribuicao, options, responsiveOptions);
		    }

	    };


	    var loadGraficoDistrubuicaoIngressosPorCategoria = function(){
	    	relatorioIngressoService.getDistribuicaoIngressosPorConfiguracao(callbackGraficoDistrubuicaoIngressosCategoria);
	    };



	    var loadGraficoIngressosPorCategoria = function(config){

			$scope.atualizacaoGraficoIngressoPorCategoria =  moment().format('D MMMM YYYY, hh:mm');
	    	
	    	var nomeSeriesGrafico = [];
	    	var valorSeriesGrafico = [];

			for (i = 0; i < config.length; i++) { 

		    	var c =  config[i];
		    	if(!c.quantidadeTotal){
		    		c.quantidadeTotal = 0;
		    	}

				nomeSeriesGrafico.push(c.tipoIngresso);
				valorSeriesGrafico.push(c.quantidadeTotal);
			}

			//console.log('serie do pizza ', valorSeriesGrafico, nomeSeriesGrafico);

	        var dadoGrafico = {
	          labels: [nomeSeriesGrafico],
	          series: valorSeriesGrafico
	        };

//	        console.log(' dados do grafico pizza ',dadoGrafico);

	        var optGrafico = {
			  labelInterpolationFnc: function(value) {
			    return value[0]
			  }
			};

			var responsiveOptGrafico = [
			  ['screen and (min-width: 640px)', {
			    chartPadding: 30,
			    labelOffset: 100,
			    labelDirection: 'explode',
			    labelInterpolationFnc: function(value) {
			      return value;
			    }
			  }],
			  ['screen and (min-width: 1024px)', {
			    labelOffset: 80,
			    chartPadding: 20
			  }]
			];

			Chartist.Pie('#chartPreferences', dadoGrafico, optGrafico, responsiveOptGrafico);

	    };



	     var loadGraficoIngressosDistribuidosPorCategoria = function(config){

			$scope.atualizacaoGraficoIngressoPorCategoria =  moment().format('D MMMM YYYY, hh:mm');
	    	
	    	var nomeSeriesGrafico = [];
	    	var valorSeriesGrafico = [];

			for (i = 0; i < config.length; i++) { 

		    	var c =  config[i];
		    	if(!c.quantidadeTotal){
		    		c.quantidadeTotal = 0;
		    	}

				nomeSeriesGrafico.push(c.tipoIngresso);
				valorSeriesGrafico.push(c.quantidadeTotal);
			}

			//console.log('serie do pizza ', valorSeriesGrafico, nomeSeriesGrafico);

	        var dadoGrafico = {
	          labels: [nomeSeriesGrafico],
	          series: valorSeriesGrafico
	        };

//	        console.log(' dados do grafico pizza ',dadoGrafico);

	        var optGrafico = {
			  labelInterpolationFnc: function(value) {
			    return value[0]
			  }
			};

			var responsiveOptGrafico = [
			  ['screen and (min-width: 640px)', {
			    chartPadding: 30,
			    labelOffset: 100,
			    labelDirection: 'explode',
			    labelInterpolationFnc: function(value) {
			      return value;
			    }
			  }],
			  ['screen and (min-width: 1024px)', {
			    labelOffset: 80,
			    chartPadding: 20
			  }]
			];

			Chartist.Pie('#chartPreferences', dadoGrafico, optGrafico, responsiveOptGrafico);

	    };


		// init
		if(eventoSelecionado){
			if(configuracoes){
				gerarEstatisticasConfiguracao(configuracoes);
				loadGraficoIngressosPorCategoria(configuracoes);
			} else {
				recuperarConfiguracaoEvento(eventoSelecionado._id);
			}

			recuperarQtdIngressos(eventoSelecionado._id);
			loadGraficoDistrubuicaoIngressos();
			loadGraficoDistrubuicaoIngressosPorCategoria();
						
		}
		

	}
);
