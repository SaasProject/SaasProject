var config = require('config.json');
var Q = require('q');
var mongoose = require('mongoose');
var Asset = mongoose.model('Asset');

var service = {};

service.getAll = getAll;

module.exports = service;

function getAll(){
    var deferred = Q.defer();

    Asset.find({}, {_id: false}, function(err, assets){
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