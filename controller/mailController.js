var nodemailer = require("nodemailer");
Setting = require("../model/settingModel");
Participant = require("../model/participantModel");

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
exports.send = function (req, res) {

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
    Setting.get(function (err, settings) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }

        const setting = settings[0];

        var votingCardImage = new Buffer(
            req.body.image.split("base64,")[1],
            "base64"
        );

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
            user: "filmpandaboo@gmail.com",
                pass: "AnakMama4",
            },
        });

        var mailOptions = {
            from: "filmpandaboo@gmail.com",
            to: req.body.to,
            subject: "PEMILU SV UNS 2021",
            html: "<h1>Halo " +
                req.body.name +
                "</h1><p>Kami mengundang anda untuk mengikuti PEMILU SV UNS 2021. Berikut kami lampirkan kartu pemilihan yang diperlukan untuk melakukan pemilihan.</p>",
                attachments: [{
                    filename: "Kartu Pemilihan_" + req.body.name + ".png",
                    content: votingCardImage,
                },
            ],

        };

        transporter.sendMail(mailOptions, (err, info) => {
            console.log("setting: " + JSON.stringify(setting));
            console.log("error: " + JSON.stringify(err));
            console.log("info: " + JSON.stringify(info));
            if (err) return res.status(500).json(err);

            Participant.findOneAndUpdate({
                _id: req.body.participantId,
            }, {
                $set: {
                    email_at: new Date(),
                },
            },
                function (err, participant) {
                    if (err) return res.status(500).send(err);

                    return res.json({
                        message: "New Email sent!",
                    });
                }
            );
        });
    });}})
};