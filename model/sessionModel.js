var mongoose = require('mongoose');

// Setup schema
var sessionSchema = mongoose.Schema({
    number: {
        type: Number,
        required: true
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
    total_participant: {
        type: Number,
        default: 0,
        required: true,
    }
});

var Session = module.exports = mongoose.model('session', sessionSchema);

module.exports.get = function (callback, limit) {
    Session.find(callback).limit(limit);
}