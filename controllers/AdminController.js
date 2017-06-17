app.controller('AdminController', function($rootScope, $scope, $http, $location, Auth, Event) {
    $scope.headingTitle = "Autentikacija ";

    $scope.list = {};

    $scope.init = function() {
    	$scope.listUsers();
    	$scope.listEvents();
    };

    $scope.listUsers = function(id) {
    	Auth.fetchAll().then(function(response) {
    		$scope.list.users = response.data;
    	});
    };

    $scope.listEvents = function(id) {
    	Event.fetchAll().then(function(response) {
    		$scope.list.events = response.data;
    	});
    };

    $scope.deleteUser = function(id) {
    	if(confirm("Sigurni ste da želite obrisati ovog korisnika?"))
    	{
    		Auth.delete(id).then(function(response) {
	    		$scope.listUsers();
	    	});

	    	showSnackbar("Uspješno ste obrisali korisnika!");
    	}
    };

    $scope.deleteEvent = function(id) {
    	if(confirm("Sigurni ste da želite obrisati ovaj event?"))
    	{
	    	Event.delete(id).then(function(response) {
	    		$scope.listEvents();
	    	});

	    	showSnackbar("Uspješno ste obrisali event!");
	    }
    };


});