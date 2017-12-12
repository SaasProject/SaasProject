(function () {
    'use strict';
 
    angular
        .module('app')
        .controller('ManageUsers.IndexController', Controller);
 
    function Controller(UserService, $scope) {
        var vm = this;
 
        vm.user = null;

        // Scope for users data
        $scope.aUsers = {
            firstName: '',
            lastName: '',
            username: '',
            userType: '',
            created_at: ''
        };
 
        initController();
 
        function initController() {
            // get current user
            UserService.GetAll().then(function (user) {
                console.log(user);
                vm.user = user;
                $scope.allUsers = user;
            });
            /*UserService.GetCurrent().then(function (user) {
                console.log(user)
                vm.user = user;
            });*/
        }

        $scope.editUser = function(index){
            console.log('index is '+index+' userid is '+$scope.allUsers[index]._id);
            $scope.aUsers = $scope.allUsers[index];
        };
    }
 
})();

/*
userService.query({usertype: 'user'}).$promise.then(function(results){ 
       console.log("nonAdmin users are: ", results);
       $scope.nonAdminUsers = results;
    }, function(error) {
      // console.log(error);
       $scope.nonAdminUsers = [];
    });
*/