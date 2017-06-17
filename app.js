var app = angular.module('app', [
  'ngRoute'
]).run(function($rootScope, $location, Auth){

    $rootScope.logout = function(){
        Auth.userLogout();
        $location.path("/");
        window.location.reload();
    }

    $('#page-loading').fadeOut('slow');
});

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
   $routeProvider
    .when('/register', {
        templateUrl : "views/registration.html",
        controller: 'AuthController',
        resolve: {
            factory: userForbidden
        }
     })
    .when('/administration', {
        templateUrl : "views/administration.html",
        controller: 'AdminController',
        resolve: {
            factory: adminOnly
        }
    })
    .when('/event/create', {
    	templateUrl : "views/event/create.html",
    	resolve: {
            factory: userOnly
        }
    })
    .when('/event/list', {
    	templateUrl : "views/event/list.html",
        resolve: {
            factory: userOnly
        }
    })
    .when('/event/show/:eventID', {
    	templateUrl : "views/event/show.html",
        controller: 'EventController',
        resolve: {
            factory: userOnly
        }
    })
    .when('/settings' , {
        templateUrl : "views/me.html",
        controller : 'AuthController',
        resolve : {
            factory : userOnly
        }
    })
    .otherwise(
        {   
            templateUrl : "views/home.html",
            resolve : {
                factory : everyone
            } 
    });
}]);

var everyone = function ($q, $rootScope, $location, Auth){
    Auth.rootAutentikacija().then(function(response){
        $('#page-loading').fadeOut('slow');
    });
}

/* Ove dijelove stranice mogu vidjeti samo korisnic */
var userOnly = function ($q, $rootScope, $location, Auth){
    // Provjeri autentikaciju
    Auth.rootAutentikacija().then(function(response){
        if(response.data != "")
            return true;
        else 
            $location.path("/register");
        $('#page-loading').fadeOut('slow');
    });
}

/* Ove dijelove stranice ne mogu vidjeti logirani korisnici */
var userForbidden = function ($q, $rootScope, $location, Auth){
    Auth.rootAutentikacija().then(function(response){
        if(response.data != "")
            $location.path("/");
        else 
            return true;
        $('#page-loading').fadeOut('slow');
    });
}

/* Admin only */
var adminOnly = function($q, $rootScope, $location, Auth) {
    Auth.rootAutentikacija().then(function(response){
        if($rootScope.user.role != "admin")
            $location.path("/");
        else 
            return true;
        $('#page-loading').fadeOut('slow');
    });
}

