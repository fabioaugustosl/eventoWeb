
eventoApp.controller('DashboardController',
	function ($scope, $routeParams, statsService){
		
		$scope.namePage = 'Dashboard';

		$scope.resumeData = statsService.resumeData;

	}
);
