const mongoose = require("mongoose");

// Import Participant model
Participant = require("../model/participantModel");
Session = require("../model/sessionModel");
var CryptoJS = require("crypto-js");

// Handle index actions
exports.index = function (req, res) {
    
    Participant.get(function (err, participants) {
        if (err) {
            return res.json({
                status: "error",
                message: err,
            });
        }

        participants = [].concat(participants).reverse();

        participants.forEach(function (participant) { 
            delete participant.code;
            delete participant.name;
            delete participant.email;
         });

        return res.json({
            status: "success",
            message: "Participant Added Successfully",
            data: participants,
    });
    });
};

// Handle search actions
exports.search = function (req, res) {

    const clientIP =
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||
        null;
    console.log("..clientIp")
    console.log(clientIP)
    Ip.find({ ip: clientIP }, function (err, client) {
        console.log("..err")
        console.log(err)
        console.log("..client")
        console.log(client)
        //if (client.length > 0) {
            Participant.find({
                name: {
                    $regex: req.params.name,
                },
            },
                function (err, participants) {
                    if (err) {
                        return res.json({
                            status: "error",
                            message: err,
                        });
                    }

                    participants = [].concat(participants).reverse();

                    return res.json({
                        status: "success",
                        message: "Participant Added Successfully",
                        data: participants,
                    });
                }
            );
        //}
    })
};

// Handle index actions
exports.indexByPage = async function (req, res) {

    const clientIP =
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||
        null;
    console.log("..clientIp")
    console.log(clientIP)
    Ip.find({ ip: clientIP }, async function (err, client) {
        console.log("..err")
        console.log(err)
        console.log("..client")
        console.log(client)
        //if (client.length > 0) {
            var page = req.params.page;
            try {
                var totalParticipant = await Participant.count();
                var participants = await Participant.find()
                    .sort({ _id: -1 })
                    .limit(10)
                    .skip((page - 1) * 10)
                    .exec();

                return res.json({
                    status: "success",
                    message: "Participant Added Successfully",
                    data: {
                        participants: participants,
                        totalPage: Math.ceil(totalParticipant / 10),
                    },
                });
            } catch (err) {
                return res.send(err);
            }
        //}
    })
};

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
function replaceAll(str, match, replacement) {
    return str.replace(new RegExp(escapeRegExp(match), 'g'), () => replacement);
}

// Handle view actions
exports.view = function (req, res) {
    console.log(req.params.id.length)


    if (req.params.id.length < 25) {

        const clientIP =
            req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress ||
            null;
            
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            const id = mongoose.Types.ObjectId(req.params.id)
            Participant.findById(id, function (err, participant) {

                console.log(".helo")
                console.log(err)
                return res.json({
                    message: "participants Detail Loading...",
                    data: participant,
                });
            });
        } else {
            Participant.find({
                name: {
                    $regex: req.params.id,
                },
            },
                function (err, participants) {
                    if (err) {
                        return res.json({
                            status: "error",
                            message: err,
                        });
                    }

                    participants = [].concat(participants).reverse();

                    return res.json({
                        status: "success",
                        message: "Participant Added Successfully",
                        data: participants,
                    });
                }
            );
        }


    } else {
        const chipertext = replaceAll(req.params.id.toString(), "8---8", '/')

        const nim = CryptoJS.AES.decrypt(chipertext, "voting-fib-okeoke").toString(CryptoJS.enc.Utf8);

        console.log("..nim")
        console.log(nim)
        Participant.findOne({
            'nim': nim
        }, function (err, participant) {
            console.log("..error participant")
            console.log(err)
            if (participant) delete participant.code
            if (err) return res.send(err);
            return res.json({
                message: "participants Detail Loading...",
                data: participant,
            });
        });
    }
};

// Handle create actions
exports.new = function (req, res) {

    const clientIP =
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||
        null;
    console.log("..clientIp")
    console.log(clientIP)
    Ip.find({ ip: clientIP }, function (err, client) {
        console.log("..err")
        console.log(err)
        console.log("..client")
        console.log(client)
        //if (client.length > 0) {
            var participant = new Participant();
            participant.name = req.body.name;
            participant.nim = req.body.nim;
            participant.email = req.body.email;
            participant.code = CryptoJS.AES.encrypt(req.body.email, "voting-sv-okeoke").toString();
            participant.code = replaceAll(participant.code, '/', '8---8');
            participant.subject = req.body.subject ? req.body.subject : '1';
            participant.session.id = req.body.sessionId;
            participant.session.number = req.body.sessionNumber;
            participant.session.min = new Date(req.body.sessionMin);
            participant.session.max = new Date(req.body.sessionMax);

            console.log("..body")
            console.log(req.body)


            // Save and validate
            participant.save(function (err) {
                console.log("..err");
                console.log(err)
                if (err) return res.status(500).json(err);


                Session.findById(req.body.sessionId, function (err, session) {

                    console.log("..err2");
                    console.log(err)
                    if (err) return res.status(500).json(err);

                    console.log(err)
                    session.total_participant++;
                    Session.findOneAndUpdate({ _id: session._id }, { $set: session }).then(
                        (session) => {
                            if (session) { } else { }
                        }
                    );
                });

                return res.json({
                    message: "New Participant Created!",
                    data: participant,
                });
            });
        //}
    })
};

// Handle update actions
exports.update = function (req, res) {

    const clientIP =
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||
        null;
    console.log("..clientIp")
    console.log(clientIP)
    Ip.find({ ip: clientIP }, function (err, client) {
        console.log("..err")
        console.log(err)
        console.log("..client")
        console.log(client)
        //if (client.length > 0) {
            var moveSession = false;
            var oldSession = {};
            var newSession = {};

            Participant.findById(req.params.id, function (err, participant) {
                if (err) throw err;
                if (participant.session.id != req.body.sessionId) {
                    moveSession = true;
                    oldSession = participant.session;
                    newSession = {
                        id: req.body.sessionId,
                        number: req.body.sessionNumber,
                        start: new Date(req.body.sessionMin),
                        end: new Date(req.body.sessionMax),
                    };
                }
            });

            Participant.findOneAndUpdate({ _id: req.params.id }, {
                $set: {
                    name: req.body.name,
                    nim: req.body.nim,
                    email: req.body.email,
                    subject: req.body.subject,
                    "session.id": req.body.sessionId,
                    "session.number": req.body.sessionNumber,
                    "session.min": new Date(req.body.sessionMin),
                    "session.max": new Date(req.body.sessionMax),
                },
            })
                .then((participant) => {
                    if (participant) {
                        if (moveSession) {
                            Session.findById(newSession.id, function (err, session) {
                                if (err) throw err;
                                session.total_participant++;
                                Session.findOneAndUpdate({ _id: session._id }, { $set: session }).then((session) => {
                                    if (session) { } else { }
                                });
                            });

                            Session.findById(oldSession.id, function (err, session) {
                                if (err) throw err;
                                session.total_participant--;
                                Session.findOneAndUpdate({ _id: session._id }, { $set: session }).then((session) => {
                                    if (session) { } else { }
                                });
                            });
                        }

                        return res.json({
                            message: "participant updated",
                            data: participant,
                        });
                    } else {
                        return res.json({
                            message: "participant not found",
                            data: {},
                        });
                    }
                })
                .catch((err) => {
                    res.json({
                        message: "error",
                        data: err,
                    });
                });
        //}
    })
};

// Handle vote actions
exports.vote = function (req, res) {
    console.log("..req")
    console.log(req.body)
    Participant.findOneAndUpdate({ _id: req.body.id_participant }, {
        $set: {
            "voting.id_candidate_bem": req.body.id_candidate_bem,
            "voting.id_candidate_legislatif": req.body.id_candidate_legislatif ? req.body.id_candidate_legislatif : '',
            "voting.time": Date(),
            "voting.counted": 0,
        },
    })
        .then((participant, err) => {
            console.log("..participant")
            console.log(participant)
            console.log("..err")
            console.log(err)
            if (participant) {
                return res.json({
                    message: "participant voted",
                    data: participant,
                });
            } else {
                console.log("..err")
                console.log(err)
                return res.json({
                    message: "participant not found",
                    data: {},
                });
            }
        })
        .catch((err) => {
            console.log("..err")
            console.log(err)
            return res.json({
                message: "error",
                data: err,
            });
        });
};

// Handle delete actions
exports.delete = function (req, res) {


    Participant.findById(req.params.id, function (err, participant) {
        if (err) return res.send(err);

        Session.findById(participant.session.id, function (err, session) {
            if (err) throw err;
            session.total_participant--;
            console.log("sessions id:" + session._id);
            Session.findOneAndUpdate({ _id: session._id }, { $set: session }).then(
                (session) => {
                    if (session) {
                        Participant.deleteOne({
                            _id: req.params.id,
                        },
                            function (err, participant) {
                                if (err) res.send(err);

                                return res.json({
                                    status: "success",
                                    message: "Participant Deleted!",
                                });
                            }
                        );
                    } else { }
                }
            );
        });
    });
};

// Handle delete actions
exports.force_delete = function (req, res) {

    Participant.deleteOne({
        _id: req.params.id,
    },
        function (err, participant) {
            if (err) res.send(err);

            res.json({
                status: "success",
                message: "Participant Deleted!",
            });
        }
    );
};