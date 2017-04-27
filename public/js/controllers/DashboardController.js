

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
				loadGraficoDistrubuicaoIngressosPorCategoria();
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
	    	if(dados){
				for (i = 0; i < dados.length; i++) { 
		        	var dado = dados[i];

		        	if(dado._id){
		        		total += dado.total;
		        	}
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

			montarDashboardTotalEntradasEvento(dados);


			if(dados && dados.length > 0){

				console.log('vamos acompanhar as entradas ', dados);

				$scope.atualizacaoGraficoEntradaEvento =  moment().format('D MMMM YYYY, hh:mm');

				var rotulos = [];
		        var serieX = [];

		        for (i = 0; i < dados.length; i++) { 
		        	var dado = dados[i];
		        	
		        	rotulos.push(dado._id.hour+' ('+dado._id.day+')');
		        	//serieX.push(dado.total);

		        	serieX.push(dado.total);

		        }

		        var data ={
		       		labels: rotulos,
			       	datasets: [{
			            label: 'Entradas por hora',
			            pointRadius: 10,
            			pointHitRadius: 30,
            			lineTension: 0.1,
			            backgroundColor: "rgba(75,192,192,0.4)",
			            borderColor: "rgba(75,192,192,1)",
			            borderCapStyle: 'butt',
			            borderDash: [],
			            borderDashOffset: 0.0,
			            borderJoinStyle: 'miter',
			            pointBorderColor: "rgba(75,192,192,1)",
			            pointBackgroundColor: "#fff",
			            pointBorderWidth: 1,
			            pointHoverRadius: 5,
			            pointHoverBackgroundColor: "rgba(75,192,192,1)",
			            pointHoverBorderColor: "rgba(220,220,220,1)",
			            data: serieX
			        }]
			    };


		        var myLineChart = new Chart($('#graficoEntradaPessoasNovo'), {
				    type: 'line',
				    data: data
				    
				});

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


		       var data ={
		       		labels: rotulos,
			       	datasets: [{
			            label: 'Quantidade de ingressos distribuidos',
			            pointRadius: 10,
            			pointHitRadius: 30,
			            data: serieX
			        }]
			    };


		        var myLineChart = new Chart($('#graficoDistribuicaoDiaNovo'), {
				    type: 'line',
				    data: data
				    
				});

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

		        console.log('dados fodasticos ', dados);

		        for (i = 0; i < dados.length; i++) { 
		        	var dado = dados[i];

		        	if(dado._id){
		        		var conf = null;//recuperarConfiguracaoPorId(dado._id);
		        		for (j = 0; j < configuracoes.length; j++) { 
					    	var c =  configuracoes[j];
					    	if(dado._id == c._id){
					    		conf = c;
					    	}
						}
		        		rotulos.push(conf.tipoIngresso);
		        		serieTotal.push(conf.quantidadeTotal);
		        		serieVendidos.push(dado.total);	
		        	}
		        }


		     	var coresPrimarias = ['#EECFA1','#CDAD00','#8B4726', '#006400', '#FF8C00', '#473C8B'];
		    	var coresSecundarias = ['#CDB38B','#FFD700','#CD6839','#556B2F', '#FF6347', '#6959CD'];

			  	var data ={
							"labels": rotulos,
							"datasets": [{
						      "label": "Ingressos por categoria",
						      "fill": "false",
						       "backgroundColor": '#006400',
						      yAxisID: "y-axis-0",
						      "data": serieTotal
						    }, {
						      "label": "Distribuidos",
						      "fill": "false",
						       "backgroundColor": '#556B2F',
						      yAxisID: "y-axis-0",
						      "data": serieVendidos
						    }]

			    };

		
		        var myBarChart = new Chart($('#graficoDistribuicaoPorCategoriaNovo'), {
				    type: 'bar',
				    data: data
				    
				});

		    }

	    };


	    var loadGraficoDistrubuicaoIngressosPorCategoria = function(){
	    	relatorioIngressoService.getDistribuicaoIngressosPorConfiguracao(callbackGraficoDistrubuicaoIngressosCategoria);
	    };



	    var loadGraficoIngressosPorCategoria = function(config){

	    	var coresPrimarias = ['#006400', '#FF8C00', '#473C8B','#EECFA1','#CDAD00','#8B4726'];
	    	var coresSecundarias = ['#556B2F', '#FF6347', '#6959CD', '#CDB38B','#FFD700','#CD6839'];

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

  			var data ={
		       		labels: nomeSeriesGrafico,
			       	datasets: [{
			            data: valorSeriesGrafico,
			            backgroundColor: coresPrimarias.splice(0,coresPrimarias.length),
			            hoverBackgroundColor: coresSecundarias.splice(0,coresSecundarias.length)
			        }]
		    };


	        var myPieChart = new Chart($('#graficoIngressosPorCategoria'), {
			    type: 'doughnut',
			    data: data
			    
			});
			
	    };



		// init
		if(eventoSelecionado){
			if(configuracoes){
				montarDashboardTotalIngressos(configuracoes);
				montarDashboardRecuperarQtdIngressos(eventoSelecionado._id, configuracoes);

				loadGraficoIngressosPorCategoria(configuracoes);
				loadGraficoDistrubuicaoIngressosPorCategoria();
				
			} else {
				recuperarConfiguracaoEvento(eventoSelecionado._id);
			}

			loadGraficoDistrubuicaoIngressos();
			loadGraficoEntradaPessoas(eventoSelecionado._id);
						
		}
		

	}
);
