(function () {
    'use strict';
 
    angular
        .module('app')
        .controller('ManageDevices.IndexController', Controller)

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
 
    function Controller(DeviceService, $scope, FlashService) {
        var vm = this;
 
		vm.device = [];

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
        
        // Scope for data
        $scope.aDevices = {
            deviceId: '',
            deviceName: '',
            location: ''
        };

        // Table sort functions
        
        // column to sort
        $scope.column = 'deviceId';

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
                return 'arrow-dormant';
            }
        } 
        // End of Table Functions

        //added by Glenn to set the width of each column
        //arbitrary only
        $scope.setWidth = function(column){
            switch(column){
                case "deviceId": return 'col-sm-2'; break;
                case "deviceName": return 'col-sm-3'; break;
                case "location": return 'col-sm-3'; break;
                default: return '';
            }
        };
 
        initController();
 
        function initController() {
            // get current user
            DeviceService.getAllDevices().then(function (device) {
				vm.device = device;
                $scope.allDevices = device;
                $scope.deviceLength = Object.size(device);
            });
        }

        // added add function
        $scope.addDevice = function(){
			if($scope.aDevices.deviceId.length===0 
                || $scope.aDevices.deviceName.length===0 
                || $scope.aDevices.location.length===0){
                FlashService.Error('Please Fill up all the textfields');
				$scope.aDevices = {deviceId: '',deviceName: '',location: ''};

            }else{
                DeviceService.addDevice($scope.aDevices)
                    .then(function () {
						initController();
			            FlashService.Success('Device Added');
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
                }
        };

      
        //filter function for pagination indexes
        function filterIndexById(input, id) {
            var i=0, len=Object.size(input);
            for (i=0; i<len; i++) {
                if (input[i]._id == id) {
                    return input[i];
                }
            }
        }

        $scope.editDevice = function(index){
            $scope.aDevices = angular.copy(filterIndexById($scope.allDevices, index));
        };
		
		vm.cancelEdit = function() {
			
			$scope.aDevices = {deviceId: '',deviceName: '',location: ''};			
			initController();
		}
		
		
		vm.updateDevice = function() {
				console.log($scope.aDevices);	
				if($scope.aDevices.deviceId.length===0 
					|| $scope.aDevices.deviceName.length===0 
					|| $scope.aDevices.location.length===0){
             		
					FlashService.Error('Please Fill up all the textfields');
					$scope.aDevices = {deviceId: '',deviceName: '',location: ''};
					
				} else {
					DeviceService.updateDevice($scope.aDevices)
						.then(function () {
							
							$scope.aDevices = {deviceId: '',deviceName: '',location: ''};
							FlashService.Success('Device Updated');
							initController();
					})
					
					.catch(function (error) {
						FlashService.Error(error);
					});
				}
        }		
		
		//deleteUser function
		vm.deleteDevice = function(index) {
			
			var toDel = filterIndexById($scope.allDevices, index);

            if (confirm("Are you sure to delete this device?")){
				
            DeviceService.Delete(toDel._id)
                 .then(function () {
					
					FlashService.Success('Device Deleted');
					initController();
					 
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
            }
        }
    }
 
})();