var config = require('config.json');
var Q = require('q');
var mongoose = require('mongoose');
var Asset = mongoose.model('Asset');

var service = {};

service.getAll = getAll;
service.addAsset = addAsset;
service.updateAsset = updateAsset;
service.delete = _delete;

module.exports = service;

function getAll(){
    var deferred = Q.defer();

    Asset.find({}, {__v: false}, function(err, assets){
        //console.log('assets.service');
        //standard error
        if(err) deferred.reject(err);

        //if documents are present
        //console.log(assets);
        if(assets.length > 0) {
            deferred.resolve(assets);
        }
        //empty collection
        else{
            deferred.resolve([]);
        }
    });

    return deferred.promise;
}

function addAsset(assetParam){
    var deferred = Q.defer();

    console.log(assetParam)


    Asset.create(assetParam, function(err){
        if (err) deferred.reject(err);
        console.log(err)
        deferred.resolve();
    });
        
    return deferred.promise;
}

function updateAsset(_id, assetParam){
    
        var deferred = Q.defer();
    
        var set = {
            tag: assetParam.tag,
            name: assetParam.name,
            warehouse: assetParam.warehouse,
            status: assetParam.status
        }
    
        Asset.update({_id : _id}, {$set: set}, {runValidators: true}, function(err){
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
 
     Asset.remove(
        { _id },
        function (err) {
            if (err) deferred.reject(err);
 
            deferred.resolve();
        });
 
    return deferred.promise;
}
