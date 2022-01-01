Setting = require("../model/settingModel");
Participant = require("../model/participantModel");
Candidate = require("../model/candidateModel");
Session = require("../model/sessionModel");

// Handle login actions
exports.login = function(req, res) {
    const clientIP = 
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress ||
    null;
    console.log("..clientIp")
    console.log(clientIP)
    Ip.find({ip: clientIP}, function(err, client){
        console.log("..err")
        console.log(err)
        console.log("..client")
        console.log(client)
        //if(client.length > 0) {
    console.log(req.body)
    Setting.find({
            "authentication.username": req.body.username,
            "authentication.password": req.body.password,
        },
        function(err, authentication) {
            if (err) throw err;
            if (authentication.length != 0) {
                res.json({
                    message: "success",
                    data: authentication,
                });
            } else {
                res.json({
                    message: "failed",
                });
            }
        }
    );//}
})
};

// Handle announcement actions
exports.announcement = function(req, res) {
    Setting.find({}, function(err, announcement) {
        if (err) throw err;
        res.json({
            data: announcement[0].announcement,
        });
    });
};

// Handle resume actions
exports.outline = function(req, res) {
    
    const clientIP = 
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress ||
    null;
    console.log("..clientIp")
    console.log(clientIP)
    Ip.find({ip: clientIP}, function(err, client){
        console.log("..err")
        console.log(err)
        console.log("..client")
        console.log(client)
        //if(client.length > 0) {

            var outline = {
                participant: 0,
                participantVoted: 0,
                candidate: 0,
                session: 0,
            };
        
            Participant.find({}, function(err, participants) {
                if (participants.length != 0) {
                    outline.participant = participants.length;
                    participants.forEach(function(participant) {
                        if (participant.voting.time != null) outline.participantVoted++;
                    });
                    Candidate.find({}, function(err, candidates) {
                        if (candidates.length != 0) outline.candidate = candidates.length;
                        Session.find({}, function(err, sessions) {
                            if (sessions.length != 0) outline.session = sessions.length;
        
                            res.json({
                                data: outline,
                            });
                        });
                    });
                }
            });
        //}
    })
};