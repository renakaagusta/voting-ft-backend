var mongoose = require('mongoose');

var participantSchema = mongoose.Schema({
    /*_id: {
        type: String,
    },*/
    name: {
        type: String,
        
    },
    nim: {
        type: String,
        
    },
    code: {
        type: String,
        
    },
    email: {
        type: String,
    },
    subject: {
        type: String,
    },
    email_at: {
        type: Date,
    },
    voting: {
        id_candidate_bem: {
            type: String,
        },
        id_candidate_legislatif: {
            type: String,
        },
        time: {
            type: Date,
        },
        counted: {
            type: Number,
        }
    },
    session: {
        id: {
            type: String,
        },
        number: {
            type: Number
        },
        min: {
            type: Date,
        },
        max: {
            type: Date,
        }
    },
    created_at: {
        type: Date,
        default: new Date(),
    }
});

var Participant = module.exports = mongoose.model('participant', participantSchema);

module.exports.get = function(callback, limit) {
    Participant.find(callback).limit(limit);
}