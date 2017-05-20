

eventoApp.factory('loginService', function($http, $log, pessoaService, Sessao){
	
	var loginService = {};
 
  	loginService.login = function (usuario, senha, dono, cbSucesso, cbErro) {
  		var cb = function(pessoa){
  			console.log(pessoa);
  			if(pessoa){
  				if(pessoa[0].senha === senha){
  					Sessao.criar(pessoa[0].id, pessoa[0].id, pessoa[0].nome, pessoa[0].login, pessoa[0].perfil);
  					cbSucesso(pessoa[0]);
  				} else {
  					cbErro("Senha incorreta");
  				}
  				
  			} else {
  				cbErro("Usuário inválido");
  			}
  		};

 	  	pessoaService.recuperarPessoaPorLogin(usuario, dono, cb);

  	};


  	loginService.logout = function (cbSucesso) {
  		Sessao.destruir();
		cbSucesso();
  	};

 
  	loginService.isAuthenticated = function () {
    	return !!Sessao.idUsuario;
  	};

 
  	loginService.isAuthorized = function (authorizedRoles) {
    	if (!angular.isArray(authorizedRoles)) {
    		  authorizedRoles = [authorizedRoles];
    	}
    	return (loginService.isAuthenticated() &&
     	 authorizedRoles.indexOf(Sessao.perfil) !== -1);
  	};

 
 	return loginService;

});
