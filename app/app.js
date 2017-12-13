(function () {
    'use strict';
 
    angular
        .module('app', ['ui.router', 'ngSanitize', 'ngCsv'])
        .config(config)
        .run(run);
 
    function config($stateProvider, $urlRouterProvider, $httpProvider) {
        // default route
        $urlRouterProvider.otherwise("/");
 
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'Home.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'home' }
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'account' }
            })
            
            //Added by Glenn
            .state('manageUsers', {
                url: '/manageUsers',
                templateUrl: 'manageUsers/index.html',
                controller: 'ManageUsers.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'manageUsers' }
            })
            
            //added by jeremy
            .state('report', {
                url: '/report',
                templateUrl: 'report/index.html',
                controller: 'Report.IndexController',
                //not yet used
                controllerAs: 'vm',
                data: {activeTab: 'report'}
            });


        // added by jeremy
        // this is to intercept all errors. when 401 is received, must redirect to login
        $httpProvider.interceptors.push(function($q, $window){
            return {
                'responseError': function(rejection){
                    var defer = $q.defer();

                    //401 is unauthorized error, meaning token has expired 
                    if(rejection.status == 401){
                        console.log('ERROR CAUGHT!');
                        alert('Your session has expired. Click Ok to login again');
                        $window.location.href = "/login";
                    }

                    defer.reject(rejection);

                    return defer.promise;
                }
            };
        });
    }
 
    function run($http, $rootScope, $window) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;
 
        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });

        //get current user and set details to rootScope
        $http.get('/api/users/isAdmin').success(function(response){
            //response is true if user is admin from api/users.controller.js
            console.log('app.js: response is ', response);
            if(response){

                // Determine if user is admin
                if(true){
                    // User can manage users
                    $rootScope.isAdmin = true;
                } else {

                    //User cannot manage users
                    $rootScope.isAdmin = false;
                }
            }
            else{
                return false;
            }
        });    
    }
 
    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;
 
            angular.bootstrap(document, ['app']);
        });
    });
})();