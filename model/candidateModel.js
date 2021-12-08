var mongoose = require('mongoose');

// Setup schema
var candidateSchema = mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
        default: ""
    },
    cv: {
        type: String,
        required: true,
        default: ""
    },
    subject: {
        type: String,
        required: true,
        default: ""
    },
    total_vote: {
        type: Number,
        default: 0
    }, 
    description: {
        short: {
            type: String,
            required: true
        },
        vision: {
            type: String,
            required: true
        },
        mission: {
            type: String,
            required: true
        }
    },
});

var Candidate = module.exports = mongoose.model('candidate', candidateSchema);

module.exports.get = function (callback, limit) {
    Candidate.find(callback).limit(limit);
}