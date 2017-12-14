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


 
    function Controller($window, AssetService, FlashService, $scope, $interval, $filter) {
 
        //initialization
        $scope.newAsset = {
            tag: '',
            name: '',
            warehouse: '',
            status: ''
        };
        $scope.assets = [];
        $scope.warehouses = [];
        $scope.currentPage = 1;
        $scope.pageSize = 10;
        
        //MUKHANG NAGPAPABAGAL ITUU
        /* $scope.$watch(function(){
            $interval(function(){
                $scope.filename = "Report " + $filter('date')(new Date(), "yyyy-MM-dd h:mma");
            }, 1000);
        }); */


        //get all assets
        AssetService.GetAll().then(function(assets){
            if(assets.length > 0){               
                //store to array
                $scope.assets = assets;

                //get the fields of assets. since it is assumed that schema is fixed, you can get fields on any object
                //keys = fields
                $scope.columns = Object.keys($scope.assets[0]);
            }
            else{
                //perform notification here
                FlashService.Error("No assets found");
            }
        }, function(){
            //perform notification here
            FlashService.Error("An error occurred");
        });

        $scope.addAsset = function(){
            console.log($scope.newAssets);
            AssetService.addAsset($scope.newAssets)
                    .then(function () {
                        FlashService.Success('Asset Added');
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
                }
        };
})();