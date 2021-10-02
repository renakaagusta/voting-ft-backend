var mongoose = require('mongoose');

// Setup schema
var settingSchema = mongoose.Schema({
    email: {
        email: {
            type: String,
            default: '',
            required: true
        },
        password: {
            type: String,
            default: '',
            required: true
        },
    },
    authentication: {
        username: {
            type: String,
            default: '',
            required: true
        },
        password: {
            type: String,
            default: '',
            required: true
        },
    },
    announcement: {
        type: Date,
        required: true
    },
    procedure: {
        type: String,
        default: "procedure.pdf",
    },
});

var Setting = module.exports = mongoose.model('setting', settingSchema);

module.exports.get = function (callback, limit) {
    Setting.find(callback).limit(limit);
}