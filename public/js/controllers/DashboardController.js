

eventoApp.controller('DashboardController',
	function ($scope, $http, $log, $sessionStorage, moment, ingressoService, relatorioIngressoService){
		
		$scope.namePage = 'Dashboard';
		$scope.atualizacaoGraficoDistribuicaoDia = null;
		$scope.atualizacaoGraficoIngressoPorCategoria = null;
		$scope.atualizacaoGraficoDistrubuicaoPorCategoria = null;
		$scope.atualizacaoGraficoEntradaEvento = null;

		var dono = $sessionStorage.dono;
		var eventoSelecionado = $sessionStorage.eventoSelecionado;

		var configuracoes = $sessionStorage.configuracoesEvento;

		//$scope.resumeData = statsService.resumeData;

		$scope.resumeData = [
		];

		

		var recuperarConfiguracaoEvento = function(idEvento){
			
			var callback = function(config){ 
				//alert('call back Dashboard config');
				console.log('Vai setar o config no storage',config);
				$sessionStorage.configuracoesEvento = config;
				configuracoes = config;

				montarDashboardTotalIngressos(config);
				montarDashboardRecuperarQtdIngressos(idEvento, config);

				loadGraficoIngressosPorCategoria(config);
			};

			ingressoService.getConfiguracoes(idEvento, callback);
		};



		var montarDashboardTotalIngressos = function(config){

			var total = 0;

			for (i = 0; i < config.length; i++) { 

		    	var c =  config[i];
		    	if(c.quantidadeTotal){
		    		total += Number(c.quantidadeTotal);
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


		var montarDashboardRecuperarQtdIngressos = function(idEvento, config){
			
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
				for (i = 0; i < config.length; i++) { 
			    	var c =  config[i];
			    	if(c.quantidadeTotal){
			    		total += Number(c.quantidadeTotal);
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



		var montarDashboardTotalEntradasEvento = function(dados){
	    	var total = 0;
			for (i = 0; i < dados.length; i++) { 
	        	var dado = dados[i];

	        	if(dado._id){
	        		total += dado.total;
	        	}
	        }

			$scope.resumeData.push(
				{
					name : 'Entradas no evento',
					classImg : 'ti-arrow-up',
					classImgStatus : 'icon-info',
					value : total,
					infoUpdate : moment().format('D MMMM YYYY, hh:mm'),
					classIcon: 'ti-reload'
				}
			);
	    };


	    /********************/
		/* funções graficos */


		var callbackGraficoEntradaPessoas = function(dados){
			if(dados && dados.length > 0){

				console.log('vamos acompanhar as entradas ', dados);

				montarDashboardTotalEntradasEvento(dados);

				$scope.atualizacaoGraficoEntradaEvento =  moment().format('D MMMM YYYY, hh:mm');

				var rotulos = [];
		        var serieX = [];

		        for (i = 0; i < dados.length; i++) { 
		        	var dado = dados[i];
		        	
		        	rotulos.push(dado._id.hour+' ('+dado._id.day+')');
		        	//serieX.push(dado.total);

		        	serieX.push({meta:dado._id.hour +'PM ', value :dado.total});

		        }

		        var dadosVendas = {
		          labels: rotulos,
		          series: [serieX]
		        };

		      /*  var plug = {
					  plugins: [
					    Chartist.plugins.tooltip()
					  ]
					};*/


				/*var dadosVendas = {
		          labels: ['9:00AM', '12:00AM', '3:00PM', '6:00PM', '9:00PM', '12:00PM', '3:00AM', '6:00AM'],
		          series: [
		             [287, 385, 490, 562, 594, 626, 698, 895, 952],
		            [67, 152, 193, 240, 387, 435, 535, 642, 744],
		            [23, 113, 67, 108, 190, 239, 307, 410, 410]
		          ]
		        };*/

		        var opcoesGraficosEntradas = {
		          lineSmooth: false,
		          low: 0,
		          high: 1000,
		          showArea: true,
		          height: "245px",
		          axisX: {
		            showGrid: true,
		          },
		          lineSmooth: Chartist.Interpolation.simple({
		            divisor: 3
		          }),
		          showLine: true,
		          showPoint: true,
		        };

		        var responsiveEntrada = [
		          ['screen and (max-width: 640px)', {
		            axisX: {
		              labelInterpolationFnc: function (value) {
		                return value[0];
		              }
		            }
		          }]
		        ];

		        Chartist.Line('#graficoEntradaPessoas', dadosVendas, opcoesGraficosEntradas, responsiveEntrada);
	    	}
	    };



		var callbackGraficoDistrubuicaoIngressos = function(dados){

		 	//console.log('chegou no callback distrubuicao ingresso por dia ',dados);

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

		      //  console.log('obj grafico distrubuicao ingressos: ', dadoDistribuicao);

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


		var loadGraficoEntradaPessoas = function(idEvento){
	    	relatorioIngressoService.getEntradasEventoPorHora(idEvento, callbackGraficoEntradaPessoas);
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

		 	// montar grafico

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
				montarDashboardTotalIngressos(configuracoes);
				montarDashboardRecuperarQtdIngressos(eventoSelecionado._id, configuracoes);

				loadGraficoIngressosPorCategoria(configuracoes);
			} else {
				recuperarConfiguracaoEvento(eventoSelecionado._id);
			}

			loadGraficoDistrubuicaoIngressos();
			loadGraficoDistrubuicaoIngressosPorCategoria();
			loadGraficoEntradaPessoas(eventoSelecionado._id);
						
		}
		

	}
);
