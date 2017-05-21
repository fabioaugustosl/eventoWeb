
eventoApp.factory('pessoaService', function($http, $log){
	
	var urlPadrao = 'http://localhost:3001';
	//var urlPadrao = 'http://ec2-35-160-247-116.us-west-2.compute.amazonaws.com:81';
	
	var urlPessoa = urlPadrao+'/api/pessoa/v1/';


	var getPessoaPorCnpj = function(cnpj, fcCallback){
		cnpj = cnpj.match(/\d/g).join(""); // somente os numeros
		$http.get(urlPessoa+"?documento_extra1="+cnpj)
			.then(
				function(data){
					fcCallback(data.data);
				},
				function(data){
					console.log('Erro encontrar pessoa por cpf');
				}
			);
	};

	
	var getPessoaPorCpf = function(cpf, fcCallback){
		cpf = cpf.match(/\d/g).join("");
		console.log('estou no service e vou fazer busca pelo cpf ',cpf);
		$http.get(urlPessoa+"?cpf="+cpf)
			.then(
				function(data){
					fcCallback(data.data);
				},
				function(data){
					console.log('Erro encontrar pessoa por cpf');
				}
			);
	};

	
	var getPessoaPorMatricula = function(matricula, fcCallback){
		$http.get(urlPessoa+"?info_extra3="+matricula)
			.then(
				function(data){
					fcCallback(data.data);
				},
				function(data){
					console.log('Erro encontrar pessoa');
				}
			);

	};


	var getPessoaPorLogin = function(login, dono, fcCallback){
		$http.get(urlPessoa+"?login="+login+"&dono="+dono)
			.then(
				function(data){
					fcCallback(data.data);
				},
				function(data){
					console.log('Erro encontrar pessoa');
				}
			);

	};



	var getPessoas = function(parametros, fcCallback){
		$http.get(urlPessoa+parametros)
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
		recuperarPessoaPorCpf	: getPessoaPorCpf,
		recuperarPessoaPorCnpj 	: getPessoaPorCnpj,
		recuperarPessoaPorLogin 	: getPessoaPorLogin,
		listar : getPessoas
	};


});