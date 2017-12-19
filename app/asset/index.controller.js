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
        $scope.pageSize = 5;
        $scope.reverse = false;
        $scope.sortColumn = "tag";
        $scope.type = "add";

        //when csv download is clicked, get the current date and format it using angular filter
        $scope.setFilename = function(){
            return "Asset Report " + $filter('date')(new Date(), "yyyy-MM-dd h:mma");
        };

        //when csv download is clicked, delete _id in each asset
        $scope.getFilteredAssets = function(){
            var temp = [];
            angular.copy($scope.filtered_assets, temp);            
            angular.forEach(temp, function(value, key){
                delete value["_id"];
            });
            return temp;
        };

        //when csv download is clicked, copy columns to a variable then delete the variable's _id
        //$scope.columns should not be directly used since it affects value and key pairs in CRUD
        //since fields in db and in existing code are lowercase, only convert them to uppercase during download
        $scope.getColumns = function(){
            var temp = [];
            //omit _id (0)
            angular.copy($scope.columns.slice(1), temp);
            angular.forEach(temp, function(value, key){
                temp[key] = $filter('uppercase')(value);
            });
            return temp;
        };

        //edited by jeremy
        //removed $scope.reverseClass as i dont see any use for it
        $scope.setTo = function(column){

            //when switching columns, sort in ascending order.
            $scope.reverse = (column != $scope.sortColumn) ? false : !$scope.reverse;
            $scope.sortColumn = column;  
        };

        //added by Glenn Add Arrow sort in table column
        $scope.sortClass = function(column){
            if($scope.sortColumn == column){
                if($scope.reverse){
                    return 'arrow-down'; 
                }else{
                    return 'arrow-up';
                }
            }else{
                return '';
            }
        }; 

        //added by jeremy to set the width of each column
        //arbitrary only
        $scope.setWidth = function(column){
            switch(column){
                case "tag": return 'col-sm-2'; break;
                case "name": return 'col-sm-3'; break;
                case "warehouse": return 'col-sm-3'; break;
                case "status": return 'col-sm-2'; break;
                default: return '';
            }
        };

        //need to store filtered assets to correct total items in pagination
        //this is so that the number of pages are correct
        $scope.$watch(function(){
            $scope.filtered_assets = $scope.$eval("assets | filter: search | orderBy: sortColumn : reverse");
        });

        function getAllAssets(){
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
            })
            .catch(function(error){
                errorFunction(error);
            });
        }

        //get all assets when controller is first loaded
        getAllAssets();
        

        $scope.addOrUpdateAsset = function(){
            if($scope.type == "add"){
                AssetService.addAsset($scope.newAsset).then(function(){
                    //get all assets to refresh the table
                    FlashService.Success('Asset Added');
                })
                .catch(function(error){
                    errorFunction(error);
                });
            }
            else{
                AssetService.updateAsset($scope.newAsset).then(function(){
                    FlashService.Success('Asset Updated');
                })
                .catch(function(error){
                    errorFunction(error);
                });
            }

            getAllAssets();
        };

        $scope.editModal = function(asset){
            $scope.type = "edit";

            //copy instead of assigning to new asset to avoid binding (changes text as you type)
            angular.copy($scope.assets[$scope.assets.indexOf(asset)], $scope.newAsset);
        };

        $scope.resetModal = function(){
            $scope.type = "add";
            $scope.newAsset = {
                tag: '',
                name: '',
                warehouse: '',
                status: ''
            };
        };
		
		
		//deleteAsset function
		$scope.deleteAsset = function(asset) {
			var toDel = $scope.assets[$scope.assets.indexOf(asset)];
			 
		//	console.log(toDel);
        
            if (confirm("Are you sure to delete this user?")){
				AssetService.Delete(toDel._id).then(function () {
					FlashService.Success('Asset Deleted');
					getAllAssets();
                })
                .catch(function(error){
                    errorFunction(error);
                });
            }
        }

        function errorFunction(error){
            if(error.code == 11000){
                FlashService.Error('Tag already exists');
            }
            else if(error.name == 'ValidationError'){
                FlashService.Error(error.message);
            }
            else{
                FlashService.Error(error);
            }
        }
    };
})();