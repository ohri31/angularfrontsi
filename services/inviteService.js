app.factory('Invite', function($rootScope, $location, $http) {

	var factory = {};

	factory.inviteUser = function(user, event) {
		return $http({
              method  : 'POST',
              url     : 'https://tim3-2.herokuapp.com/invitation/create',
              data    : $.param({"eventID" : event, "invited" : user}),  
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            return data;
        })
        .error(function(data) {
        	return false;
        });
	}


	/* Odgovori na ivnite */
	factory.responde = function(response, invitation) {
		return $http({
              method  : 'POST',
              url     : 'https://tim3-2.herokuapp.com/invitation/responde',
              data    : $.param({"invitationID" : invitation, "response" : response}),  
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            return data;
        })
        .error(function(data) {
        	return false;
        });
	}

	/* Odustani od poziva */
	factory.cancle = function(invitationID) {
		return $http({
              method  : 'POST',
              url     : 'https://tim3-2.herokuapp.com/invitation/remove',
              data    : $.param({"invitationID" : invitationID, "userID" : $rootScope.user.id}),  
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            return data;
        })
        .error(function(data) {
        	return false;
        });
	}

	/* Lista svih eventova na koje nismo odgovorili */
	factory.getNotResponded = function(id) {
		return $http({
              method  : 'POST',
              url     : 'https://tim3-2.herokuapp.com/invitation/notResponded',
              data    : $.param({"user" : id}),  
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            return data;
        })
        .error(function(data) {
        	return false;
        });
	}

	/* Lista svih eventova koje smo prihvatili ili kreirali */
	factory.getMyEvents = function(id) {
		return $http({
              method  : 'POST',
              url     : 'https://tim3-2.herokuapp.com/invitation/myEvents',
              data    : $.param({"user" : id}),  
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