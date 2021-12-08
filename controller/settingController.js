// Import Setting model
Setting = require("../model/settingModel");

var multer = require("multer");
var path = require("path");

const storage = multer.diskStorage({
    destination: path.join(__dirname + "./../public"),
    filename: function(req, file, cb) {
        console.log(file.originalname);
        cb(null, "procedure.pdf");
    },
});

const upload = multer({
    storage: storage,
}).single("file");

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
        if(client.length > 0) {
    console.log("ip: " + JSON.stringify(ip));
    Setting.get(function(err, settings) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Setting Added Successfully",
            data: settings,
        });
    });}})
};

// Handle create actions
exports.new = function(req, res) {
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
        if(client.length > 0) {
    var setting = new Setting();
    setting.email.email = req.body.emailEmail;
    setting.email.password = req.body.emailPassword;
    setting.authentication.username = req.body.authenticationUsername;
    setting.authentication.password = req.body.authenticationPassword;
    setting.announcement = req.body.announcement;

    // Save and validate
    setting.save(function(err, err2) {
        if (err) res.json(err);
        console.log(err)
        console.log("...")
        console.log(err2)
        res.json({
            message: "New Setting Created!",
            data: setting,
        });
    });}})
};

// Handle view actions
exports.view = function(req, res) {

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
        if(client.length > 0) {
    Setting.findById(req.params.id, function(err, setting) {
        if (err) res.send(err);
        res.json({
            message: "settings Detail Loading...",
            data: setting,
        });
    });}})
};

// Handle update actions
exports.update = function(req, res) {

    Setting.findOneAndUpdate({ _id: req.params.id }, {
            $set: {
                "email.email": req.body.emailEmail,
                "email.password": req.body.emailPassword,
                "authentication.username": req.body.authenticationUsername,
                "authentication.password": req.body.authenticationPassword,
                announcement: new Date(req.body.announcement),
            },
        })
        .then((setting) => {
            if (setting) {
                res.json({
                    message: "setting updated",
                    data: setting,
                });
            } else {
                res.json({
                    message: "setting not found",
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

// Handle upload actions
exports.upload = function(req, res) {

    upload(req, res, (err) => {
        console.log("..err")
        console.log(err)
        if (err) throw err;

        res.json({
            message: "success upload",
        });
    });
};

// Handle delete actions
exports.delete = function(req, res) {

    Setting.remove({
            _id: req.params.id,
        },
        function(err, setting) {
            if (err) res.send(err);
            res.json({
                status: "success",
                message: "Setting Deleted!",
            });
        }
    );
};