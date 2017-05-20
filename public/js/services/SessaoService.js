eventoApp.service('Sessao', function(){
	
	 this.criar = function (sessionId, idUsuario, nome, login, perfil) {
	    this.id = sessionId;
	    this.idUsuario = idUsuario;
	    this.perfil = perfil;
	    this.nome = nome;
	    this.login = login;
	  };

	  this.destruir = function () {
	    this.id = null;
	    this.idUsuario = null;
	    this.perfil = null;
	    this.nome = null;
	    this.login = null;
	  };


});
