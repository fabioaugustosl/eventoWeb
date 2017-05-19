

eventoApp.controller('EntradaTempoRealController',
	function ($scope, $http, $log, $sessionStorage, $interval, ingressoService){
		var entradaCtrl = this;
	
		$scope.tituloPagina = 'Acompanhamento de acesso ao evento em tempo real';
		var dono = $sessionStorage.dono;
		entradaCtrl.evento = $sessionStorage.eventoSelecionado;
		

		entradaCtrl.entradas =  [];
		entradaCtrl.ultimasEntradas =  [];



		var callbackTempoReal = function(novasEntradas) {
			
			if(novasEntradas){
				console.log(entradaCtrl.entradas.length);
				console.log(novasEntradas);

				if(novasEntradas.length > 3){
					for (i = novasEntradas.length; i > 3; i--){
						entradaCtrl.ultimasEntradas.push(entradaCtrl.entradas[i]);
					}		
					novasEntradas = novasEntradas.splice(0,3);
				}

				if(entradaCtrl.entradas){
					for (i = 0; i < entradaCtrl.entradas.length; i++){
						console.log(entradaCtrl.ultimasEntradas);
						entradaCtrl.ultimasEntradas.push(entradaCtrl.entradas[i]);
					}		
					
				}
				
				entradaCtrl.entradas = novasEntradas;

				if(entradaCtrl.ultimasEntradas.length > 20){
					entradaCtrl.ultimasEntradas = entradaCtrl.ultimasEntradas.splice(0, 20);	
				}
				
			}
		};





		var recuperarNovasEntradas = function(idIngresso){
			var data = moment().add(-1, 'days');
			console.log('data moment ', data);
			if(entradaCtrl.entradas && entradaCtrl.entradas.length > 0){
				var ing = entradaCtrl.entradas[0];
				data = ing.dataBaixa;
			}

			console.log('data apos entrada ', data);

			ingressoService.getIngressosEntrada(data, callbackTempoReal);		
		};


		$interval( function(){ recuperarNovasEntradas(); }, 5000);


		//recuperarNovasEntradas();


	}
);
