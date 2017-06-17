app.factory('Chat', function($rootScope, $location, $http) {

	var factory = {};

	factory.addMessage = function(message, event) {
		return $http({
              method  : 'POST',
              url     : 'https://tim3-2.herokuapp.com/message/create',
              data    : $.param({"text" : message, "u" : $rootScope.user.id, "e" : event}),  
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            return data;
        })
        .error(function(data) {
        	return false;
        });
	}

	factory.getEventMessages = function(event) {
		return $http({
              method  : 'POST',
              url     : 'https://tim3-2.herokuapp.com/message/event',
              data    : $.param({"eventID" : event}),  
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            return data;
        })
        .error(function(data) {
        	return false;
        });
	}

	return factory;

});