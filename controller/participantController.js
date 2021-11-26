const mongoose = require("mongoose");

// Import Participant model
Participant = require("../model/participantModel");
Session = require("../model/sessionModel");

var ip = [
    "36.81.8.39",
    "115.178.245.1",
    "120.188.87.161",
    "182.2.70.49",
    "36.82.16.96",
    "182.1.113.100",
    "36.72.212.123",
    "180.242.214.231",
    "182.2.41.152",
    "182.0.198.123",
    "36.65.160.63",
    "182.2.40.27",
    "36.74.208.155",
    "182.2.71.32",
    "182.0.237.81",
    "103.79.154.187",
    "114.5.109.44",
    "182.2.37.131",
    "120.188.74.160",
    "182.2.39.180",
    "36.73.209.231",
    "36.81.10.12",
    "180.252.99.137",
    "112.215.240.127",
    "202.80.218.42"
];

// Handle index actions
exports.index = function(req, res) {
    Participant.get(function(err, participants) {
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
    });
};

// Handle search actions
exports.search = function(req, res) {


    Participant.find({
            name: {
                $regex: req.params.name,
            },
        },
        function(err, participants) {
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
};

// Handle index actions
exports.indexByPage = async function(req, res) {


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
};

// Handle view actions
exports.view = function(req, res) {
    const id = mongoose.Types.ObjectId('6156ea00bd1e52132cadac7a')
    Participant.findById(id, function(err, participant) {
        console.log(req.params.id)
        console.log(participant)
        if (err) return res.send(err);
        return res.json({
            message: "participants Detail Loading...",
            data: participant,
        });
    });
};

// Handle create actions
exports.new = function(req, res) {


    var participant = new Participant();
    participant.name = req.body.name;
    participant.nim = req.body.nim;
    participant.email = req.body.email;
    participant.session.id = req.body.sessionId;
    participant.session.number = req.body.sessionNumber;
    participant.session.min = new Date(req.body.sessionMin);
    participant.session.max = new Date(req.body.sessionMax);

    // Save and validate
    participant.save(function(err) {
        if (err) return res.status(500).json(err);

        console.log("..err");
        console.log(err)

        Session.findById(req.body.sessionId, function(err, session) {
            
        console.log("..err2");
        console.log(err)
            if (err) return res.status(500).json(err);
            console.log("..err3");
            console.log(err)
            session.total_participant++;
            Session.findOneAndUpdate({ _id: session._id }, { $set: session }).then(
                (session) => {
                    if (session) {} else {}
                }
            );
        });

        return res.json({
            message: "New Participant Created!",
            data: participant,
        });
    });
};

// Handle update actions
exports.update = function(req, res) {

    var moveSession = false;
    var oldSession = {};
    var newSession = {};

    Participant.findById(req.params.id, function(err, participant) {
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
                "session.id": req.body.sessionId,
                "session.number": req.body.sessionNumber,
                "session.min": new Date(req.body.sessionMin),
                "session.max": new Date(req.body.sessionMax),
            },
        })
        .then((participant) => {
            if (participant) {
                if (moveSession) {
                    Session.findById(newSession.id, function(err, session) {
                        if (err) throw err;
                        session.total_participant++;
                        Session.findOneAndUpdate({ _id: session._id }, { $set: session }).then((session) => {
                            if (session) {} else {}
                        });
                    });

                    Session.findById(oldSession.id, function(err, session) {
                        if (err) throw err;
                        session.total_participant--;
                        Session.findOneAndUpdate({ _id: session._id }, { $set: session }).then((session) => {
                            if (session) {} else {}
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
};

// Handle vote actions
exports.vote = function(req, res) {
    Participant.findOneAndUpdate({ _id: req.body.id_participant }, {
            $set: {
                "voting.id_candidate_bem": req.body.id_candidate_bem,
                "voting.id_candidate_legislatif": req.body.id_candidate_legislatif,
                "voting.time": Date(),
                "voting.counted": 0,
            },
        })
        .then((participant) => {
            if (participant) {
                return res.json({
                    message: "participant voted",
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
            return res.json({
                message: "error",
                data: err,
            });
        });
};

// Handle delete actions
exports.delete = function(req, res) {


    Participant.findById(req.params.id, function(err, participant) {
        if (err) return res.send(err);

        Session.findById(participant.session.id, function(err, session) {
            if (err) throw err;
            session.total_participant--;
            console.log("sessions id:" + session._id);
            Session.findOneAndUpdate({ _id: session._id }, { $set: session }).then(
                (session) => {
                    if (session) {
                        Participant.deleteOne({
                                _id: req.params.id,
                            },
                            function(err, participant) {
                                if (err) res.send(err);

                                return res.json({
                                    status: "success",
                                    message: "Participant Deleted!",
                                });
                            }
                        );
                    } else {}
                }
            );
        });
    });
};

// Handle delete actions
exports.force_delete = function(req, res) {

    Participant.deleteOne({
            _id: req.params.id,
        },
        function(err, participant) {
            if (err) res.send(err);

            res.json({
                status: "success",
                message: "Participant Deleted!",
            });
        }
    );
};