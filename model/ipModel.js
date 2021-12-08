var mongoose = require('mongoose');

// Setup schema
var ipSchema = mongoose.Schema({
    ip: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: new Date()
    }
});

var Ip = module.exports = mongoose.model('ip', ipSchema);

module.exports.get = function (callback, limit) {
    Ip.find(callback).limit(limit);
}