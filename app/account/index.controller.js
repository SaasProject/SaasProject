(function () {
    'use strict';
 
    angular
        .module('app')
        .controller('Account.IndexController', Controller);
 
    function Controller($window, UserService, FlashService) {
        var vm = this;
 
        vm.user = null;
        vm.saveUser = saveUser;
        vm.deleteUser = deleteUser;
 
        initController();
 
        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
        }
 
        function saveUser() {
            if(vm.user.password===undefined){
                console.log(vm.user.password);
                FlashService.Error("Enter New Password");
            }else{
                if(vm.user.password != vm.user.confirmPassword){
                    console.log('wew');
                    console.log(vm.user.password);
                    FlashService.Error("Password doesn't match");
                }else{
                    UserService.Update(vm.user)
                        .then(function () {
                            FlashService.Success('User updated');
                        })
                        .catch(function (error) {
                            FlashService.Error(error);
                        });
                }
            }
        }
 
        function deleteUser() {

            if (confirm("sure to delete?")){


            UserService.Delete(vm.user._id)
                .then(function () {
                    // log user out
                    $window.location = '/login';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
            }
        }
    }
 
})();