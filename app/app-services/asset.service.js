(function () {
    'use strict';
 
    angular
        .module('app')
        .factory('AssetService', Service);
 
    function Service($http, $q) {
        var service = {};
 
        service.GetAll = GetAll;
        service.addAsset = addAsset;
		service.Delete = Delete;
 
        return service;
 
        function GetAll() {
            return $http.get('/api/assets/getAll').then(handleSuccess, handleError);
        }

        function addAsset(assets) {
            return $http.post('/api/assets/addAsset', assets).then(handleSuccess, handleError);
        }
		
		 function Delete(tag) {
            return $http.delete('/api/assets/' + tag).then(handleSuccess, handleError);
        }
  
        // private functions
 
        function handleSuccess(res) {
            return res.data;
        }
 
        function handleError(res) {
            return $q.reject(res.data);
        }
    }
 
})();