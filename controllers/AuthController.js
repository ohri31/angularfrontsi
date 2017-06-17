/* global $ */
app.controller('AuthController', function($rootScope, $scope, $http, $location, Auth) {
    $scope.headingTitle = "Autentikacija ";

    /*******************
    	Registracija korisnika
    *******************/

    // Podaci iz forme
    $scope.formRegistrationData = {};

    // Poruka za registraciju
    $scope.status = {
    	uspjeh : false,
    	neuspjeh : false,
    	poruka : ""
    }

    // Procesiranje forme
    $scope.processRegistrationForm = function() {
        if($scope.registrationValidation()) {
            $scope.regValErrors = "";
            Auth.register($scope.formRegistrationData).then(function(response) {
                if(response.data)
                {
                    $scope.status.uspjeh    = true;
                    $scope.status.neuspjeh  = false;
                    $scope.status.poruka    = "Uspješno ste se registrovali!";

                    // Ako je uspješna registraicja, odradi login
                    Auth.login($scope.formRegistrationData.email, $scope.formRegistrationData.password).then(function(data){
                        if(data != false)
                        {
                            // Root autentikacija i prebacivanje na početnu
                            Auth.rootAutentikacija().then(function(resAut){
                                if(resAut) $location.path("/");
                            });
                        }
                        else
                        {
                            $scope.status.uspjeh    = false;
                            $scope.status.neuspjeh  = true;
                            $scope.status.poruka    = "Račun je kreiran, ali se nismo uspjeli prijaviti na sistem.";
                        }
                    });
                }
                else
                {
                    $scope.status.uspjeh    = false;
                    $scope.status.neuspjeh  = true;
                    $scope.status.poruka    = "Korisnik već postoji.";
                }
            });
        }
    };

    $scope.regValErrors = "";
    $scope.registrationValidation = function() {
        $scope.regValErrors = "";
        var valid = true;
        // Ime mora biti uneseno
        var pattern = /^[A-ZŠŽĐĆČ][a-zčćšžđ]{2,35}\s[A-ZŠŽĐĆČ][a-zčćšžđ]{2,35}$/u;
        if($scope.formRegistrationData.name.length == 0 || !pattern.test($scope.formRegistrationData.name)) {
            $scope.regValErrors += "Ime i prezime nisu uneseni ili su neispravnog formata. ";
            valid = false;
        }

        // Email mora imati mail format
        //
        var pattern = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(com|org|net|gov|ba)\b$/i;
        if(!pattern.test($scope.formRegistrationData.email)) {
            $scope.regValErrors += "E-mail mora imati ispravan format. ";
            valid = false;
        }

        // Password mora biti jednak jedan sa drugim
        if($scope.formRegistrationData.password != $scope.formRegistrationData.repPassword) {
            $scope.regValErrors += "Password i ponovljeni password se ne podudaraju ";
            valid = false;
        }

        // Password mora imati više od osam karaktera
        if($scope.formRegistrationData.password.length < 8) {
            $scope.regValErrors += "Password mora imati minimalno 8 karaktera. ";
            valid = false;
        }

        return valid;
    }

    /*******************
    	Prijava korisnika
    *******************/

    $scope.formLoginData = {};

    $scope.loginStatus = {
        logovan : false,
        poruka : ""
    }

    $scope.logValErrors = "";
    $scope.processLoginForm = function() {
        if($scope.loginValidation()){
            $scope.logValErrors = "";
            Auth.login($scope.formLoginData.email, $scope.formLoginData.password).then(function(response){

                if(response.data != 0)
                {
                    Auth.rootAutentikacija().then(function(resAut){
                        console.log(resAut);
                        if(resAut.data) $location.path("/");
                    });
                }
                else
                {
                    $scope.loginStatus.logovan = false;
                    $scope.loginStatus.poruka = "Nažalost, pristupni podaci nisu ispravni.";
                }

            });
        }
    }
    $scope.loginValidation = function() {
      $scope.logValErrors = "";
      var valid = true;

      // Email mora biti unesen
      if($scope.formLoginData.email.length == 0) {
          $scope.logValErrors += "Email mora biti unesen. ";
          valid = false;
      }

      // Email mora imati mail format
      var pattern = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(com|org|net|gov|ba)\b$/i;
      if(!pattern.test($scope.formLoginData.email)) {
          $scope.logValErrors += "Uneseni e-mail mora imati ispravan format. ";
          valid = false;
      }

      // Password mora biti unesen
      if($scope.formLoginData.password.length == 0) {
          $scope.logValErrors+= "Password mora biti unesen. ";
          valid = false;
      }

      // Password mora imate najmanje 8 znakova
      if($scope.formLoginData.password.length < 8) {
          $scope.logValErrors += "Uneseni password mora imati najmanje 8 znakova. ";
          valid = false;
      }

      return valid;
    }

    /*******************
        Reset password
    *******************/

    $scope.resetPassword = function() {
        var email = prompt("Unesite Vaš email");
        Auth.resetPassword(email).then(function(response) {
            console.log(response);
            if(response.data)
                showSnackbar("Uspješno resetovan password! Provjerite Vaš e-mail.");
            else
                showSnackbar("Nažalost, došlo je do greške.");
        });
    }

    /***************
        Novi password
        ****************/

    $scope.pass = {};
    $scope.promijeniPassowrd = function() {
        Auth.changePassword($scope.pass.old, $scope.pass.new).then(function(response) {
            if(response.data)
                showSnackbar("Uspješno ste promijenili password!");
            else
                showSnackbar("Nažalost, došlo je do greške.");
        });
    }

    /**************
        Obrisi racun
        ***************/
    $scope.obrisiRacun = function() {
        if(confirm("Sigurni ste da želite obrisati Vaš račun?"))
        {
            Auth.deleteUser().then(function(response) {
                if(response.data)
                    $location.path('/');
                else
                    showSnackbar("Nažalost, došlo je do greške.");
            });
        }
    }



});
