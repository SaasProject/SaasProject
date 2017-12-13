(function () {
    'use strict';
 
    angular
        .module('app')
        .controller('Report.IndexController', Controller);
 
    function Controller($window, AssetService, FlashService, $scope) {
 
        $scope.assets = [];
        $scope.warehouses = [];
        AssetService.GetAll().then(function(assets){
            if(assets.length > 0){
                console.log('you retrieved all assets');
                //console.log(assets);                
                $scope.assets = assets;

                //get the fields of assets. since it is assumed that schema is fixed, you can get fields on any object
                //keys = fields
                $scope.columns = Object.keys($scope.assets[0]);

                //value is the current asset in assets, key is index
                angular.forEach($scope.assets, function(value, key){
                    //console.log(key);
                    //console.log(value.warehouse);

                    //check if warehouse already exists. if yes, don't add.
                    //this is to eliminate duplicates in datalist
                    if($scope.warehouses.indexOf(value.warehouse) == -1){
                        $scope.warehouses.push(value.warehouse);
                    } 
                });
               // console.log($scope.columns);
            }
            else{
                //perform notification here
                FlashService.Error("No assets found");
                console.log('No assets found');
            }
        }, function(){
            //perform notification here
            FlashService.Error("An error occurred");
            console.log('error');
        });

        //to get filtered assets in the table
        //source: https://stackoverflow.com/questions/11721863/angularjs-how-to-get-an-ngrepeat-filtered-result-reference
        $scope.$watch(function(){
            //search.warehouse is ng-model of warehouse input field (generateReport.html). this specifies that the filter is only for warehouse column
            //source: https://stackoverflow.com/questions/14733136/ng-repeat-filter-by-single-field
            $scope.filtered_assets = $scope.$eval("assets | filter : search");
        });
    }
 
})();