

eventoApp.controller('EntradaTempoRealController',
	function ($scope, $http, $log, $sessionStorage, $interval, ingressoService){
		var entradaCtrl = this;
	
		$scope.tituloPagina = 'Acompanhamento de acesso ao evento em tempo real';
		var dono = $sessionStorage.dono;
		entradaCtrl.evento = $sessionStorage.eventoSelecionado;
		

		entradaCtrl.entradas =  [];
		entradaCtrl.ultimasEntradas =  [];



		var callbackTempoReal = function(novasEntradas) {
			
			if(novasEntradas && novasEntradas.length > 0){
				//console.log(entradaCtrl.entradas.length);
				//console.log(novasEntradas);

				if(novasEntradas.length > 3){
					for (i = novasEntradas.length; i > 3; i--){
						entradaCtrl.ultimasEntradas.push(entradaCtrl.entradas[i]);
					}		
					novasEntradas = novasEntradas.splice(0,3);
				}

				if(entradaCtrl.entradas && novasEntradas && novasEntradas.length > 0){
					for (i = 0; i < entradaCtrl.entradas.length; i++){
						var e = entradaCtrl.entradas[i];
						var ja = false;
						//console.log(entradaCtrl.ultimasEntradas);
						for(var j = entradaCtrl.ultimasEntradas.length; j > 0 ; j--){
							var u = entradaCtrl.ultimasEntradas[(j-1)];
							if(u.chave == e.chave){
								ja = true;
								break;
							}
						}
						if(!ja){
							entradaCtrl.ultimasEntradas.push(e);
						}
					}
					entradaCtrl.entradas = [];		
				
				} 

				entradaCtrl.entradas = novasEntradas;
								

				if(entradaCtrl.ultimasEntradas.length > 15){
					entradaCtrl.ultimasEntradas = entradaCtrl.ultimasEntradas.splice(0, 15);	
				}
				
			}
		};





		var recuperarNovasEntradas = function(idIngresso){
			var data = moment().add(-1, 'hour').format();
			console.log('data moment ', data);
			if(entradaCtrl.entradas && entradaCtrl.entradas.length > 0){
				var ing = entradaCtrl.entradas[0];
				if(ing.dataBaixa){
					data = moment(ing.dataBaixa).format();
				}

			}

			console.log('data apos entrada ', data);

			ingressoService.getIngressosEntrada(data, callbackTempoReal);		
		};


		$interval( function(){ recuperarNovasEntradas(); }, 8000);


		//recuperarNovasEntradas();


	}
);
