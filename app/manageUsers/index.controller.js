(function () {
    'use strict';
 
    angular
        .module('app')
        .controller('ManageUsers.IndexController', Controller);
 
    function Controller(UserService, $scope, FlashService) {
        var vm = this;
 
        vm.user = null;

        // Scope for users data
        $scope.aUsers = {
            _id: '',
            role: '',
            firstName: '',
            lastName: '',
            username: '',
            email: ''
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

        // added adduser function
        $scope.addUser = function(){
            console.log($scope.aUsers);
            UserService.Insert($scope.aUsers)
                .then(function () {
                    FlashService.Success('User updated');
                    $scope.aUsers = {
                        role: '',
                        firstName: '',
                        lastName: '',
                        username: '',
                        email: ''
                    };
                    initController();
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });

        };

        $scope.clearField = function(){
            $scope.aUsers = "";
        }

        $scope.editUser = function(index){
            console.log('index is '+index+' userid is '+$scope.allUsers[index]._id);
            //$scope.aUsers = $scope.allUsers[index];

            $scope.aUsers._id = $scope.allUsers[index]._id;
            $scope.aUsers.role = $scope.allUsers[index].role;
            $scope.aUsers.firstName = $scope.allUsers[index].firstName;
            $scope.aUsers.lastName = $scope.allUsers[index].lastName;
            $scope.aUsers.username = $scope.allUsers[index].username;
            $scope.aUsers.email = $scope.allUsers[index].email;

            console.log($scope.aUsers._id);
        };
		
		
		vm.updateUser = function() {
			
			//console.log(index);
			
			// var toDel = vm.user[index];
			// console.log(toDel._id);
			// console.log(toDel.username);
			
            UserService.Update($scope.aUsers)
                .then(function () {
				    $scope.aUsers = {
                        role: '',
                        firstName: '',
                        lastName: '',
                        username: '',
                        email: ''
                    };
                    FlashService.Success('User updated');
                    initController();
					
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
		
		
		
		
		
		//deleteUser function
		vm.deleteUser = function(index) {
			
			console.log(index);
			
			var toDel = vm.user[index];
			console.log(toDel._id);
			console.log(toDel.username);
			
			
            if (confirm("Are you sure to delete this user?")){
				
             UserService.Delete(toDel._id)
                 .then(function () {
					
					FlashService.Success('User Deleted');
					initController();
					 
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
            }
        }
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