(function () {
    'use strict';
 
    angular
        .module('app')
        .controller('Asset.IndexController', Controller)
        //filter function for pagination of assets
        .filter('pagination', function(){
            return function(data, start){
                //data is an array. slice is removing all items past the start point
                return data.slice(start);
            };
        });


 
    function Controller($window, AssetService, FlashService, $scope) {
 
        //initialization
        $scope.assets = [];
        $scope.warehouses = [];
        $scope.currentPage = 1;
        $scope.pageSize = 10;
        
        var fulldate = new Date();
        var date = fulldate.getFullYear() + "-" + fulldate.getMonth() + "-" + fulldate.getDate();
        $scope.filename = "Report " + date;

        //get all assets
        AssetService.GetAll().then(function(assets){
            if(assets.length > 0){               

                //store to array
                $scope.assets = assets;

                //get the fields of assets. since it is assumed that schema is fixed, you can get fields on any object
                //keys = fields
                $scope.columns = Object.keys($scope.assets[0]);

                //value is the current asset in assets, key is index
                angular.forEach($scope.assets, function(value, key){

                    //check if warehouse already exists. if yes, don't add.
                    //this is to eliminate duplicates in datalist
                    if($scope.warehouses.indexOf(value.warehouse) == -1){
                        $scope.warehouses.push(value.warehouse);
                    } 
                });
            }
            else{
                //perform notification here
                FlashService.Error("No assets found");
            }
        }, function(){
            //perform notification here
            FlashService.Error("An error occurred");
        });
    }
 
})();
