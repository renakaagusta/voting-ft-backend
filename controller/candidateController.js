// Import Candidate model
Candidate = require("../model/candidateModel");

var multer = require("multer");
var path = require("path");

var id = "";

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

const storage = multer.diskStorage({
    destination: path.join(__dirname + "./../public"),
    filename: function(req, file, cb) {
        if (path.extname(file.originalname) != ".pdf") {
            cb(null, id + ".jpg");
        } else {
            cb(null, id + ".pdf");
        }
    },
});

const upload = multer({
    storage: storage,
}).single("file");

// Handle index actions
exports.index = function(req, res) {
    Candidate.get(function(err, candidates) {
        if (err) {
            return res.json({
                status: "error",
                message: err,
            });
        }

        return res.json({
            status: "success",
            message: "Candidate Added Successfully",
            data: candidates,
        });
    });
};

// Handle create actions
exports.new = function(req, res) {

    var candidate = new Candidate();
    candidate.type = req.body.type;
    candidate.name = req.body.name;
    candidate.number = req.body.number;
    candidate.image = "avatar.jpg";
    candidate.cv = " ";
    candidate.subject = req.body.subject ? req.body.subject : "1";
    candidate.description.short = req.body.shortDescription;
    candidate.description.mission = req.body.missionDescription;
    candidate.description.vision = req.body.visionDescription;

    // Save and validate
    candidate.save(function(err) {
        if (err) return res.json(err);
        return res.json({
            message: "New Candidate Created!",
            data: candidate,
        });
    });
};

// Handle view actions
exports.view = function(req, res) {
    console.log(req.params)
    Candidate.findById(req.params.id, function(err, candidate) {
        if (err) return res.send(err);
        return res.json({
            message: "candidates Detail Loading...",
            data: candidate,
        });
    });
};

// Handle update actions
exports.update = function(req, res) {

    id = req.params.id;
    Candidate.findOneAndUpdate({ _id: id }, {
            $set: {
                name: req.body.name,
                number: req.body.number,
                subject: req.body.subject ? req.body.subject : "1",
                "description.short": req.body.shortDescription,
                "description.vision": req.body.visionDescription,
                "description.mission": req.body.missionDescription,
            },
        })
        .then((candidate) => {
            if (candidate) {
                return res.json({
                    message: "candidate updated",
                    data: candidate,
                });
            } else {
                return res.json({
                    message: "candidates not found",
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

// Handle upload actions
exports.upload = function(req, res) {

    type = req.body.type;
    id = req.params.id;

    upload(req, res, (err) => {
        if (err) throw err;

        Candidate.findOneAndUpdate({
                _id: id,
            }, {
                $set: {
                    image: id + ".jpg",
                    cv: id + ".pdf",
                },
            },
            function(err, candidate) {
                if (err) throw err;

                return res.json({
                    message: "success upload",
                });
            }
        );
    });
};

// Handle count actions
exports.count = function(req, res) {

    Candidate.findById(req.body.id, function(err, candidate) {
        if (err) throw err;
        candidate.total_vote++;
        Candidate.findOneAndUpdate({ _id: candidate._id }, { $set: candidate }).then((candidate) => {
            if (candidate) {
                return res.json({
                    message: "candidate voted",
                    data: candidate,
                });
            } else {
                return res.json({
                    message: "candidate not found",
                    data: {},
                });
            }
        });
    });
};

// Handle delete actions
exports.delete = function(req, res) {

    Candidate.remove({
            _id: req.params.id,
        },
        function(err, candidate) {
            if (err) return res.send(err);
            return res.json({
                status: "success",
                message: "Candidate Deleted!",
            });
        }
    );
};