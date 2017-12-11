var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema if asset.warehouse has no reference
var assetSchema = new mongoose.Schema({
    asset_id: {type: String, index: {unique: true}},
    name: {type: String, required: true},
    warehouse: {type: String, required: true},
    status: {type: String, required: true},
});

mongoose.model('Asset', assetSchema);