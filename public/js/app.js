
var eventoApp = angular.module('eventoApp', ['ngRoute', 'ngStorage', 'ngMaterial', 'angular-md5', 'angularMoment', 'ngMask'])
		.config(function($routeProvider, $locationProvider, $logProvider) {
			$routeProvider.when('/index', {template:'/view/dashboard.html', controller: 'DashboardController'})
						  .when('/dashboard', {templateUrl:'/view/dashboard.html', controller: 'DashboardController'})
						  //.when('/user', {templateUrl:'/view/user.html', controller: 'UserController'})
						  .when('/user', {templateUrl:'/view/pessoas.html', controller: 'UsuariosController'})
						  .when('/ingressos', {templateUrl:'/view/ingressos.html', controller: 'IngressoController'})
						  .when('/novoIngresso', {templateUrl:'/view/novoIngresso.html', controller: 'IngressoCadastroController'})
						  .when('/configurarEvento', {templateUrl:'/view/eventoCadastro.html', controller: 'EventoCadastroController'})
						  .when('/tempoReal', {templateUrl:'/view/entradaTempoReal.html', controller: 'EntradaTempoRealController'})
						  .otherwise({redirectTo:'/index'});

			$locationProvider.html5Mode(true);
			
			$logProvider.debugEnabled(true);
			console.log('ROTA CONFIG');
		}).directive('focus',
			function($timeout) {
				return {
					scope : {
						trigger : '@focus'
					},
					link : function(scope, element) {
						scope.$watch('trigger', function(value) {
							if (value === "true") {
								$timeout(function() {
									element[0].focus();
								});
							}
						});
					}
				};
			}
		);




