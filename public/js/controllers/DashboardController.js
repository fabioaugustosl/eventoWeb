

eventoApp.controller('DashboardController',
	function ($scope, $http, $log, $sessionStorage, $timeout, moment, ingressoService, relatorioIngressoService){
		var dashboardCtrl = this;
		console.log("Dashboard");
		$scope.namePage = 'Dashboard';
		dashboardCtrl.atualizacaoGraficoDistribuicaoDia = null;
		dashboardCtrl.atualizacaoGraficoIngressoPorCategoria = null;
		dashboardCtrl.atualizacaoGraficoDistrubuicaoPorCategoria = null;
		dashboardCtrl.atualizacaoGraficoEntradaEvento = null;
		dashboardCtrl.atualizacaoGraficoEntradaPorCategoria = null;

		var dono = $sessionStorage.dono;
		var eventoSelecionado = $sessionStorage.eventoSelecionado;

		var configuracoes = $sessionStorage.configuracoesEvento;

		//$scope.resumeData = statsService.resumeData;

		$scope.resumeData = [
		];

		

		var recuperarConfiguracaoEvento = function(idEvento){
			
			var callback = function(config){ 
				//alert('call back Dashboard config');
				console.log('Vai setar o config no storage: ',config);
				$sessionStorage.configuracoesEvento = config;
				configuracoes = config;

				montarDashboardTotalIngressos(config);
				montarDashboardRecuperarQtdIngressos(idEvento, config);



				$timeout(function(){loadGraficoIngressosPorCategoria(config)},1000);
				$timeout(function(){loadGraficoDistrubuicaoIngressosPorCategoria()},500);
				loadGraficoEntradaPorCategoria(idEvento);
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

				//console.log('vamos acompanhar as entradas ', dados);

				dashboardCtrl.atualizacaoGraficoEntradaEvento =  moment().format('D MMMM YYYY, hh:mm');

				var rotulos = ['10 AM','11 AM','12 pM','13 PM','14 PM','15 PM','16 PM','17 PM','18 PM','19 PM','20 PM','21 PM','22 PM','23 PM','00 AM','1 AM','2 AM','3 AM','4 AM','5 AM','6 AM','7 AM','8 AM','9 AM'];
		        var serieX = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

		        for (i = 0; i < dados.length; i++) { 
		        	var dado = dados[i];
		        	
		        	//rotulos.push(dado._id.hour+' ('+dado._id.day+')');
		        	//serieX.push(dado.total);

		        	//serieX.push(dado.total);
		        	var h = (dado._id.hour-10);
		        	if(h < 0){
		        		h =  (23 + h) + 1;
		        	}
		        	serieX[h] = dado.total;

		        }

		        //console.log('horas compiladas ',serieX);

		        var data ={
		       		labels: rotulos,
			       	datasets: [{
			            label: 'Entradas por hora',
			            pointRadius: 10,
            			pointHitRadius: 30,
            			//lineTension: 0.1,
			            backgroundColor: "rgba(75,192,192,0.4)",
			            borderColor: "rgba(75,192,192,1)",
			            //borderCapStyle: 'butt',
			           // borderDash: [],
			            //borderDashOffset: 0.0,
			            //borderJoinStyle: 'miter',
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
				    type: 'bar',
				    data: data
				    
				});

	    	}
	    };


	    var callbackGraficoEntradaPorCategoria = function(dados){

		 	if(dados && dados.length > 0){
				dashboardCtrl.atualizacaoGraficoEntradaPorCategoria =  moment().format('D MMMM YYYY, hh:mm');

			 	var rotulos = [];
		        var serieAcompanhantes = [];
		        var serieAssociados = [];

		        //console.log('dados entrada por categoria ', dados, configuracoes);

		        for (i = 0; i < dados.length; i++) { 
		        	var dado = dados[i];

		        	if(dado.categoria){
		        		var conf = null;//recuperarConfiguracaoPorId(dado._id);
		        		for (j = 0; j < configuracoes.length; j++) { 
					    	var c =  configuracoes[j];
					    	if(dado.categoria == c._id){
					    		conf = c;
					    	}
						}
						//console.log(conf);
		        		rotulos.push(conf.tipoIngresso);
		        		serieAssociados.push(dado.totaUnico);
		        		var totalAcompanhantes = dado.totalIngressos - dado.totaUnico;
		        		serieAcompanhantes.push(totalAcompanhantes);	
		        	}
		        }


		     	var coresPrimarias = ['#006400', '#FF8C00','#EECFA1','#CDAD00','#8B4726',  '#473C8B'];
		    	var coresSecundarias = ['#CDB38B','#FFD700','#CD6839','#556B2F', '#FF6347', '#6959CD'];

			  	var data ={
							"labels": rotulos,
							"datasets": [{
						      "label": "Associados",
						      "fill": "false",
						       "backgroundColor": '#006400',
						      yAxisID: "y-axis-0",
						      "data": serieAssociados
						    }, {
						      "label": "Acompanhantes",
						      "fill": "false",
						       "backgroundColor": '#FF8C00',
						      yAxisID: "y-axis-0",
						      "data": serieAcompanhantes
						    }]

			    };

		
		        var myBarChart = new Chart($('#graficoEntradaPorCategoria'), {
				    type: 'bar',
				    data: data,
				    options: {
				        scales: {
				            xAxes: [{
				                stacked: true
				            }],
				            yAxes: [{
				                stacked: true
				            }]
				        }
				    }
				    
				});

		    }

	    };


		var callbackGraficoDistrubuicaoIngressos = function(dados){

		 	//console.log('chegou no callback distrubuicao ingresso por dia ',dados);

		 	if(dados && dados.length > 0){
				dashboardCtrl.atualizacaoGraficoDistribuicaoDia =  moment().format('D MMMM YYYY, hh:mm');

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


		var loadGraficoEntradaPorCategoria= function(idEvento){
	    	relatorioIngressoService.getEntradasEventoPorCategoria(idEvento, callbackGraficoEntradaPorCategoria);
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
				dashboardCtrl.atualizacaoGraficoDistrubuicaoPorCategoria =  moment().format('D MMMM YYYY, hh:mm');

			 	var rotulos = [];
		        var serieVendidos = [];
		        var serieTotal = [];

		        //console.log('dados fodasticos ', dados, configuracoes);

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
						//console.log(conf);
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
						      "label": "Total ingressos",
						      "fill": "false",
						       "backgroundColor": '#006400',
						      yAxisID: "y-axis-0",
						      "data": serieTotal
						    }, {
						      "label": "Distribuidos",
						      "fill": "false",
						       "backgroundColor": '#8B4726',
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

	    	console.log('CHAMOU O GRAFICO TAL',config);
	    	var coresPrimarias = ['#006400', '#FF8C00', '#473C8B','#EECFA1','#CDAD00','#8B4726'];
	    	var coresSecundarias = ['#556B2F', '#FF6347', '#6959CD', '#CDB38B','#FFD700','#CD6839'];

			
	    	
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

  			var dataIngCateg ={
		       		labels: nomeSeriesGrafico,
			       	datasets: [{
			            data: valorSeriesGrafico,
			            backgroundColor: coresPrimarias.splice(0,coresPrimarias.length),
			            hoverBackgroundColor: coresSecundarias.splice(0,coresSecundarias.length)
			        }]
		    };

	        var myPieChart = new Chart($('#graficoIngressosPorCategoria'), {
			    type: 'doughnut',
			    data: dataIngCateg
			});

			dashboardCtrl.atualizacaoGraficoIngressoPorCategoria =  moment().format('D MMMM YYYY, hh:mm');
			
	    };



	    //console.log(eventoSelecionado);
	    //console.log('USUARIO LOGADO: ',$sessionStorage.usuarioLogado);
		// init
		if(eventoSelecionado){
			if(configuracoes){
				montarDashboardTotalIngressos(configuracoes);
				montarDashboardRecuperarQtdIngressos(eventoSelecionado._id, configuracoes);

				$timeout(function(){loadGraficoIngressosPorCategoria(configuracoes)}, 1000);
				$timeout(function(){loadGraficoDistrubuicaoIngressosPorCategoria()}, 500);
				loadGraficoEntradaPorCategoria(eventoSelecionado._id);
				
			} else {
				recuperarConfiguracaoEvento(eventoSelecionado._id);
			}

			loadGraficoDistrubuicaoIngressos();
			loadGraficoEntradaPessoas(eventoSelecionado._id);

						
		}
		

	}
);
