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
        $scope.pageSize = 12;
        $scope.reverse = false;
        $scope.sortColumn = "tag";

        //when csv download is clicked, get the current date and format it using angular filter
        $scope.setFilename = function(){
            return "Report " + $filter('date')(new Date(), "yyyy-MM-dd h:mma");
        };

        //when a header is clicked, set the orderBy to the current column. then reverse the order by using "!""
        $scope.setTo = function(column){
            $scope.sortColumn = column;
            $scope.reverse = !$scope.reverse;
        };

        function getAllAssets(){
            //get all assets
            AssetService.GetAll().then(function(assets){
                if(assets.length > 0){               
                    //store to array
                    $scope.assets = assets;
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

        //get all assets when controller is first loaded
        getAllAssets();
        
        //get the fields of assets. since it is assumed that schema is fixed, you can get fields on any object
        //keys = fields
        $scope.columns = Object.keys($scope.assets[0]);
        

        $scope.addAsset = function(){
            console.log($scope.newAssets);
            AssetService.addAsset($scope.newAssets)
                    .then(function () {
                        //get all assets to refresh the table
                        getAllAssets();
                        FlashService.Success('Asset Added');
                    })
                    .catch(function (error) {
                        if(error.code == 11000){
                            FlashService.Error('Tag already exists');                            
                        }
                        else{
                            FlashService.Error(error.errmsg);
                        }
                    });
                }
        };
})();
