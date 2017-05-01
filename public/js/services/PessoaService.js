
eventoApp.factory('pessoaService', function($http, $log){
	
	//var urlPadrao = 'http://localhost:3001';
	var urlPadrao = 'http://ec2-35-160-247-116.us-west-2.compute.amazonaws.com:81';
	
	var urlPessoa = urlPadrao+'/api/pessoa/v1/';

	
	var getPessoaPorMatricula = function(matricula, fcCallback){
		$http.get(urlPessoa+"?documento_extra1="+matricula)
			.then(
				function(data){
					fcCallback(data.data);
				},
				function(data){
					console.log('Erro encontrar pessoa');
				}
			);

	};


	var getPessoas = function(fcCallback){
		$http.get(urlPessoa)
			.then(
				function(data){
					fcCallback(data.data);
				},
				function(data){
					console.log('Erro listar pessoas');
				}
			);

	};
	

	return {
		recuperarPessoaPorMatricula : getPessoaPorMatricula,
		listar : getPessoas
	};


});
