(function () {
    'use strict';
 
    angular
        .module('app')
        .controller('ManageUsers.IndexController', Controller)

        //Added by glenn to filter objects
        .filter('orderObjectBy', function() {
          return function(items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function(item) {
              filtered.push(item);
            });
            filtered.sort(function (a, b) {
              return (a[field] > b[field] ? 1 : -1);
            });
            if(reverse) filtered.reverse();
            return filtered;
          };
        })

        //filter function for pagination of users
        .filter('pagination', function(){
            return function(data, start){
                //data is an array. slice is removing all items past the start point
                return data.slice(start);
            };
        });
 
    function Controller(UserService, $scope, FlashService) {
        var vm = this;
 
        vm.user = [];

        // function to convert object to array
        Object.size = function(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        };

        // initialize pages of user list
        $scope.currentPage = 1;
        $scope.pageSize = 10;
        
        // Scope for users data
        $scope.aUsers = {
            role: '',
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password:''
        };

        // Table sort functions
        
        // column to sort
        $scope.column = 'role';

        // sort ordering (Ascending or Descending). Set true for desending
        $scope.reverse = false; 

        // called on header click
        $scope.sortColumn = function(col){
            $scope.column = col;
            if($scope.reverse){
                $scope.reverse = false;
                $scope.reverseclass = 'arrow-up';
            }else{
                $scope.reverse = true;
                $scope.reverseclass = 'arrow-down';
            }
        };

        // remove and change class
        $scope.sortClass = function(col){
            if($scope.column == col ){
                if($scope.reverse){
                    return 'arrow-down'; 
                }else{
                    return 'arrow-up';
                }
            }else{
                return '';
            }
        } 
        // End of Table Functions
 
        initController();
 
        function initController() {
            // get current user
            UserService.GetAll().then(function (user) {
                vm.user = user;
                $scope.allUsers = user;
                $scope.userLength = Object.size(user);
            });
        }

        // added adduser function
        $scope.addUser = function(){
            if($scope.aUsers.role.length===0 
                || $scope.aUsers.firstName.length===0 
                || $scope.aUsers.lastName.length===0  
                || $scope.aUsers.username.length===0  
                || $scope.aUsers.email.length===0 ){
                FlashService.Error('Please Fill up all the textfields');
            }else{
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (var i = 0; i < 10; i++){
                    $scope.aUsers.password += possible.charAt(Math.floor(Math.random() * possible.length));
                }

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

        //filter function for pagination indexes
        function filterIndexById(input, id) {
            var i=0, len=Object.size(input);
            for (i=0; i<len; i++) {
                if (input[i]._id == id) {
                    return input[i];
                }
            }
        }

        $scope.editUser = function(index){
            $scope.aUsers = filterIndexById($scope.allUsers, index);
        };
		
		
		vm.updateUser = function() {
			
			 if($scope.aUsers.role.length===0 
                || $scope.aUsers.firstName.length===0 
                || $scope.aUsers.lastName.length===0  
                || $scope.aUsers.username.length===0  
                || $scope.aUsers.email.length===0 ){
					FlashService.Error('Please Fill up all the textfields');
				} else {
			          console.log($scope.aUsers);
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
			
			var toDel = vm.user[index];

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