var config = require('config.json');
var Q = require('q');
var mongoose = require('mongoose');
var Device = mongoose.model('Device');

var service = {};

service.getAllDevices = getAllDevices;
service.addDevice = addDevice;
service.updateDevice = updateDevice;
service.delete = _delete;

module.exports = service;

function getAllDevices(){
    var deferred = Q.defer();
    Device.find({}, {__v: false}, function(err, devices){
        if(err) deferred.reject(err);

        //if documents are present
        if(devices.length > 0) {
            deferred.resolve(devices);
        }

        //empty collection
        else{
            deferred.resolve([]);
        }
    });

    return deferred.promise;
}

function addDevice(deviceParam){
    var deferred = Q.defer();

    Device.create(deviceParam, function(err){
        if (err) deferred.reject(err);
        deferred.resolve();
    });
        
    return deferred.promise;
}

function updateDevice(_id, deviceParam){
    
        var deferred = Q.defer();
    
        var set = {
            deviceId: deviceParam.deviceId,
            deviceName: deviceParam.deviceName,
            location: deviceParam.location,
        }
    
        Device.update({_id : _id}, {$set: set}, {runValidators: true}, function(err){
            if(err) {
               deferred.reject(err);
               console.log(err);
            }
            deferred.resolve();
        });
    
        return deferred.promise;
    }

function _delete(_id) {
    var deferred = Q.defer();
 
    Device.remove(
        { _id },
        function (err) {
            if (err) deferred.reject(err);
 
            deferred.resolve();
        });
 
    return deferred.promise;
}
