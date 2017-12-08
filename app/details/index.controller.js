(function () {
    'use strict';
 
    angular
        .module('app')
        .controller('Details.IndexController', Controller);
 
    function Controller($window,UserService,FlashService) {
        var vm = this;
 
        vm.user = null;
        vm.saveComment = saveComment;
 
        initController();
 
        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
        }

        function saveComment() {
            UserService.Update(vm.user)
                .then(function () {
                    FlashService.Success('Comment updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }
})();