app.factory('Auth', function($rootScope, $location, $http) {

    var factory = {}; 

    factory.register = function(data) {
        return $http({
              method  : 'POST',
              url     : 'https://tim3deploy.herokuapp.com//user/create',
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

    factory.login = function(email, password) {

        return $http({
              method  : 'POST',
              url     : 'https://tim3deploy.herokuapp.com//user/login',
              data    : $.param({ "email" : email, "password" : password }),  
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            console.log(data);
            if(data == "0")
            {
                return false;
            }
            else
            {
                setCookie("authToken", data);
                return data;
            }
        });
    }

    factory.rootAutentikacija = function() {

      $rootScope.user = {};
      $rootScope.userLogged = false;

      var token = getCookie("authToken");

        $rootScope.user = {
          authToken : token,
          name : false,
          email : false,
          role : false,
          id : 0
        }

        console.log("tu");

        return $http({
          method  : 'POST',
          url     : 'https://tim3deploy.herokuapp.com//user/checkToken',
          data    : $.param({ "token" : token }),  
          headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
          
            if(data == 0)
            {
              return false;
            }
            else
            {
              $rootScope.user.name  = data.name;
              $rootScope.user.email = data.email;
              $rootScope.user.role  = data.role;
              $rootScope.user.id    = data.id;
              $rootScope.userLogged = true;
              return true;
            }

            return false;
        })
        .error(function(data) {
          return false;
        });
    }

    factory.userLogout = function() {

              destroyCookie("authToken");
              $rootScope.user = {
                    authToken : 0,
                    name : false,
                    email : false,
                    role : false,
                    id : 0
              };
              $rootScope.loggedUser = false;

      return true;
    }

    factory.showUsers = function(name) {
      return $http({
              method  : 'GET',
              url     : 'https://tim3deploy.herokuapp.com//user/name/'+name,
              data    : $.param({"i" : "i"}),  
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            return data;
        })
        .error(function(data) {
            return false;
        });
    }

    factory.reportUser = function(user, reason) {
    return $http({
              method  : 'POST',
              url     : 'https://tim3deploy.herokuapp.com//user/report',
              data    : $.param({"userID" : user, "reason" : reason}),
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
              url     : 'https://tim3deploy.herokuapp.com//user/all',
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
              url     : 'https://tim3deploy.herokuapp.com//user/delete/'+id,
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            return data;
        })
        .error(function(data) {
            return false;
        });
    }

    factory.resetPassword = function(email) {
        return $http({
              method  : 'POST',
              url     : 'https://tim3deploy.herokuapp.com//user/resetpassword',
              data    : $.param({"mail" : email}),
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            return data;
        })
        .error(function(data) {
            return false;
        });
    }

    factory.changePassword = function(old, newPass) {
        return $http({
              method  : 'POST',
              url     : 'https://tim3deploy.herokuapp.com//user/changepassword',
              data    : $.param({"oldPass" : old, "newPass" : newPass, "id" : $rootScope.user.id}),
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            return data;
        })
        .error(function(data) {
            return false;
        });
    }

    factory.deleteUser = function() {
        return $http({
              method  : 'POST',
              url     : 'https://tim3deploy.herokuapp.com//user/delete',
              data    : $.param({"id" : $rootScope.user.id}),
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