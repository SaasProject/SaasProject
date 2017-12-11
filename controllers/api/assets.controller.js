var express = require('express');
var router = express.Router();
var assetService = require('services/asset.service');

router.get('/getAll', getAllAssets);

module.exports = router;

function getAllAssets(req, res){
    assetService.getAll().then(function(assets){
        console.log('assets.controller');
        //console.log(assets);
        if(assets){
            res.send(assets);
        }
        else{
            res.send(404);
        }
    }).catch(function(err){
        res.status(400).send(err);
    });
}