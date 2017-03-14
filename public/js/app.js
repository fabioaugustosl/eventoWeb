
var eventoApp = angular.module('eventoApp', ['ngRoute'])
		.config(function($routeProvider, $locationProvider) {
			$routeProvider.when('/dashboard', {templateUrl:'/view/dashboard.html', controller: 'DashboardController'})
						  .when('/user', {templateUrl:'/view/user.html', controller: 'UserController'})
						  .when('/ingressos', {templateUrl:'/view/table.html', controller: 'IngressoController'})
						  .when('/novoIngresso', {templateUrl:'/view/novoIngresso.html', controller: 'IngressoCadastroController'})
						  .otherwise({redirectTo:'/dashboard'});

			$locationProvider.html5Mode(true);
		});




