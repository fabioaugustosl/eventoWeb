

eventoApp.controller('IngressoCadastroController',
	function ($scope, $http, $log, ingressoService){
		var ingressoCtrl = this;
		ingressoCtrl.msg = '';

		$scope.tituloPagina = 'Novo Ingresso';
		ingressoCtrl.novoIngresso = {};

		var limparIngresso = function(){
			ingressoCtrl.novoIngresso = {};
			ingressoCtrl.novoIngresso.dono = "produminas";
			ingressoCtrl.novoIngresso.idEvento = "ev01";
			ingressoCtrl.novoIngresso.nomeEvento = "Evento Teste Produminas";	
		};
		
		$scope.submit = function() {
			console.log("Estamos no controller novo ingresso: ", ingressoCtrl.novoIngresso);
			ingressoCtrl.msg = "Ingresso gerado com sucesso!";
			
			ingressoService.novoIngresso(ingressoCtrl.novoIngresso);	
			limparIngresso();
		};

		limparIngresso();
	}
);
