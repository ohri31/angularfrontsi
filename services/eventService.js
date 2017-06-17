app.factory('Event', function($rootScope, $location, $http) {

	var factory = {};

	factory.create = function(data)
	{
		return $http({
              method  : 'POST',
              url     : 'https://tim3-2.herokuapp.com/event/create',
              data    : $.param(data),  
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            return data;
        })
        .error(function(data) {
        	return false;
        });
	}

	factory.get = function(id)
	{
		return $http({
              method  : 'GET',
              url     : 'https://tim3-2.herokuapp.com/event/'+id,
              data    : $.param({"status" : "status"}),  
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            return data;
        })
        .error(function(data) {
        	return false;
        });
	}

	factory.delete = function(id)
	{
		return $http({
              method  : 'POST',
              url     : 'https://tim3-2.herokuapp.com/event/delete/'+id,
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            return data;
        })
        .error(function(data) {
        	return false;
        });
	}

	factory.invitedUsers = function(id) {
		return $http({
              method  : 'POST',
              url     : 'https://tim3-2.herokuapp.com/invitation/event',
              data	  : $.param({ "eventID" : id }),
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            return data;
        })
        .error(function(data) {
        	return false;
        });
	}

	factory.reportEvent = function(user, id, reason) {
		return $http({
              method  : 'POST',
              url     : 'https://tim3-2.herokuapp.com/event/report',
              data	  : $.param({"userID" : user, "eventID" : id, "reason" : reason}),
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            return data;
        })
        .error(function(data) {
        	return false;
        });
	}

	factory.fetchAll = function() {
      return $http({
              method  : 'GET',
              url     : 'https://tim3-2.herokuapp.com/event/all',
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            return data;
        })
        .error(function(data) {
            return false;
        });
    }

    factory.delete = function(id) {
        return $http({
              method  : 'POST',
              url     : 'https://tim3-2.herokuapp.com/event/delete/'+id,
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