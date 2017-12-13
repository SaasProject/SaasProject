(function () {
    'use strict';
 
    angular
        .module('app')
        .controller('ManageUsers.IndexController', Controller);
 
    function Controller(UserService, $scope, FlashService) {
        var vm = this;
 
        vm.user = null;

        var modal = $scope.myModal;

        // Scope for users data
        $scope.aUsers = {
            role: '',
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password:''
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
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 10; i++){
                $scope.aUsers.password += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            console.log($scope.aUsers.password);
            if($scope.aUsers.role.length===0 
                || $scope.aUsers.firstName.length===0 
                || $scope.aUsers.lastName.length===0  
                || $scope.aUsers.username.length===0  
                || $scope.aUsers.email.length===0 ){
                console.log("wew");
                FlashService.Error('Please Fill up all the textfields');
            }else{
            UserService.Insert($scope.aUsers)
                .then(function () {
                    FlashService.Success('User updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
            }
        };

        $scope.clearField = function(){
            $scope.aUsers = {
            role: '',
            firstName: '',
            lastName: '',
            username: '',
            email: ''
            };
        }

        $scope.editUser = function(index){
            console.log('index is '+index+' userid is '+$scope.allUsers[index]._id);
            $scope.aUsers = $scope.allUsers[index];
        };
		
		
		vm.updateUser = function() {
			
			 if($scope.aUsers.role.length===0 
                || $scope.aUsers.firstName.length===0 
                || $scope.aUsers.lastName.length===0  
                || $scope.aUsers.username.length===0  
                || $scope.aUsers.email.length===0 ){
					console.log("wew");
					FlashService.Error('Please Fill up all the textfields');
				} else {
			
					UserService.Update($scope.aUsers)
						.then(function () {
							$scope.aUsers = {role: '', firstName: '', lastName: '', username: '', email: ''};
							FlashService.Success('User updated');
							initController();
					})
					
					.catch(function (error) {
						FlashService.Error(error);
					});
				}
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