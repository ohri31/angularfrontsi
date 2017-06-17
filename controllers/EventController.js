app.controller('EventController', function($rootScope, $scope, $http, $location, $routeParams, Event, Auth, Invite, Chat) {
    $scope.headingTitle = "Event";

    /* Kreiranje eventa */
    $scope.formData = {};
    $scope.createError = "";


    $scope.createEventProcess = function() {
        $scope.formData.user            = $rootScope.user.id;
        $scope.formData.voteDeadline    = parseInt(moment($scope.formData.voteDeadline).tz("Europe/Sarajevo").format('x'));
        $scope.formData.dateAndTime     = parseInt(moment($scope.formData.dateAndTime).tz("Europe/Sarajevo").format('x'));

        if($scope.eventFromValidation()){
            console.log($scope.formData);

            Event.create($scope.formData).then(function(response){
              if(response.data != 0 && response.data != false)
              {
                /* Ako nam je vratio ID eventa, redirektuj */
                $location.path('event/show/'+response.data);
              }
              else
              {
                /* ako je vratio nulu ili false izbaci error */
                $scope.createError = "Došlo je do greške prilikom izrade eventa.";
              }

            });
        }
    }

  /* Validacija create event forme */

  $scope.eventFromValidation = function(){
    $scope.createError = "";
    var valid = true;

    /*Polje za naziv eventa mora biti uneseno*/
    var pattern = /^[a-zA-Z0-9čćšžđČŠĐĆŽ\s]{2,80}$/u;
    if(typeof $scope.formData.name === 'undefined' || !pattern.test($scope.formData.name)) {
        $scope.createError += "Naziv eventa nije unesen ili sadrži ilegalne karaktere.";
        valid = false;
    }

    /* Lokacija eventa mora biti unesena */
    var pattern = /^[a-zA-Z0-9čćšžđČŠĐĆŽ\s]{2,120}$/u;
    if(typeof $scope.formData.location === 'undefined' || !pattern.test($scope.formData.location)) {
        $scope.createError += "Lokacija eventa nije unesena ili sadrži ilegalne karaktere. ";
        valid = false;
    }

    /* Polje za datum i vrijeme eventa mora biti unseno */
    if(typeof $scope.formData.dateAndTime === 'undefined') {
        $scope.createError += "Datum i vrijeme eventa mora biti uneseno. ";
        valid = false;
    }

    /*Deadline za glasanje ne smije biti prije datuma eventa */
    /*MIRZONI PROVJERI OVO!!!*/
    $scope.formData.voteDeadline 	= parseInt(moment($scope.formData.voteDeadline).tz("Europe/Sarajevo").format('x'));
    $scope.formData.dateAndTime 	= parseInt(moment($scope.formData.dateAndTime).tz("Europe/Sarajevo").format('x'));
    if($scope.formData.voteDeadline >= $scope.formData.dateAndTime){
      $scope.createError += "Deadline za glasanje ne smije biti prije datuma ogranizovanja eventa. ";
      valid = false;
    }

    return valid;
  }

    /* Showing event informations on page */
    $scope.event = {};

    $scope.showEvent = function() {
    	$scope.event.id = $routeParams.eventID;

    	Event.get($scope.event.id).then(function(response){
    		$scope.event = response.data;
    		$scope.invitedUsersFunc($scope.event.id);
    	});
    }

    /* List users */
    $scope.usersList;
    $scope.errorPorukica = "";
    $scope.showUsers = function(name) {
    	if(name.invName != "")
    	{
    		Auth.showUsers(name.invName).then(function(response) {
    			if(response.data.length == 0)
    				$scope.errorPorukica = "Nažalost, korisnik ne postoji.";
    			else
    				$scope.userList = response.data;
    		});
    	}else{
    		$scope.userList = {};
    		$scope.errorPorukica = "";
    	}
    }

    /* Chek if user is connected to this event */
    $scope.invited = false;
    $scope.checkUser = function() {
    	angular.forEach($scope.invitedUsers, function(value, key) {
			if(value.id == $rootScope.user.id){ $scope.invited = true; }
		});

		if(!$scope.invited) $location.path('/');
    }

    /* Invite user to an event */
    $scope.inviteUser = function(id) {
    	Invite.inviteUser(id, $scope.event.id).then(function(response){
    		if(response.data) {
    			showSnackbar("Uspješno poslana pozivnica!");
    			$scope.invitedUsersFunc($scope.event.id);
    		}
    		else
    			showSnackbar("Korisnik je već pozvan na ovaj event.");
    	});
    }

    /* Delete event */
    $scope.deleteEvent = function() {
    	if($rootScope.user.id = $scope.event.id)
    	{
    		Event.delete($scope.event.id).then(function(response) {
    			if(response.data)
    				$location.path('/');
    			else
    				$scope.errorPorukica = "Niste uspjeli obrisati event.";
    		});
    	}
    }

    /* Cancle invite */
    $scope.cancleInvite = function(invitationID) {
    	console.log("tu");
    	Invite.cancle(invitationID).then(function(response) {
    		$location.path('/event/list');
    	});
    }

    /* Show initializtion function */
    $scope.$watch('user.id', function() {
    	$scope.notRespondedFun();
    	$scope.showMyEvents();
    	$scope.loadMessages();
    });

    /* Show not responded invite */
    $scope.notResponded = {};
    $scope.notRespondedFun = function() {
    	$scope.notResponded = {};
    	Invite.getNotResponded($rootScope.user.id).then(function(response) {
    		$scope.notResponded = response.data;
    	});
    }

    /* Show my events */
    $scope.myEvents = {};
    $scope.showMyEvents = function() {
    	$scope.myEvents = {};
    	Invite.getMyEvents($rootScope.user.id).then(function(response) {
    		$scope.myEvents = response.data;
    	});
    }

    /* Repsonde to invitation */
    $scope.responde = function(response, invitation) {
    	Invite.responde(response, invitation).then(function(response) {
    		$scope.notRespondedFun();
    		$scope.showMyEvents();
    	});
    }

    /* Get invited users */
    $scope.invitedUsers = {};
    $scope.invitedUsersFunc = function(eventID) {
    	Event.invitedUsers(eventID).then(function(response) {
    		$scope.invitedUsers = response.data;
    		$scope.checkUser();
    	});
    }

    /* Report event */
    $scope.reportThisEvent = function() {
    	var reason = prompt("Molimo Vas unesite razlog prijave:");
        if(reason == "") {
          alert("Morate unijeti razlog.");  
          $scope.reportThisEvent();
        } else if(reason) {
            Event.reportEvent($rootScope.user.id, $scope.event.id, reason).then(function(response) {
                if(response.data) showSnackbar("Uspješno prijavljen event.");
                else showSnackbar("Niste u mogućnosti prijaviti ovaj event.");
            });
        } else {
            console.log("lol");
        }
    }

    /* Report useer */
     $scope.reportThisUser = function(userID) {
    	var reason = prompt("Molimo Vas unesite razlog prijave:");
        if(reason == "") {
            alert("Morate unijeti razolog.");
            $scope.reportThisUser(userID);
        } else if(reason) {
            Auth.reportUser(userID, reason).then(function(response) {
                if(response.data) showSnackbar("Uspješno prijavljen korisnik.");
                else showSnackbar("Niste u mogućnosti prijaviti korisnika.");
            });
        } else {
            console.log("lol");
        }
    }

    /****************************************
		CHat system event related functions
    *****************************************/

    /* Load event mesages */
    $scope.messages = {};
    $scope.loadMessages = function() {
    	Chat.getEventMessages($scope.event.id).then(function(response) {
    		$scope.messages = response.data;
    	});
    }


    /* Messageing system */
    $scope.porukaSend = "";
    $scope.sendMessage = function() {
    	if($scope.porukaSend != "") {
    		Chat.addMessage($scope.porukaSend, $scope.event.id).then(function(response) {
    			$scope.loadMessages();
    			$scope.porukaSend = "";
    		});
    	}
    }


});
