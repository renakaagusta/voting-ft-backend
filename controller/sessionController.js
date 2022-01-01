// Import Session model
Session = require("../model/sessionModel");
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
exports.index = function (req, res) {
  Session.get(function (err, sessions) {
    if (err) {
      res.json({
        status: "error",
        message: err,
      });
    }
    res.json({
      status: "success",
      message: "Session Added Successfully",
      data: sessions,
    });
  });
};

// Handle create actions
exports.new = function (req, res) {
  
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
  var session = new Session();
  session.number = req.body.number;
  session.start = new Date(req.body.start);
  session.end = new Date(req.body.end);

  // Save and validate
  session.save(function (err) {
    if (err) res.json(err);
    res.json({
      message: "New Session Created!",
      data: session,
    });
  });
//}
})
};

// Handle view actions
exports.view = function (req, res) {
  
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
  Session.findById(req.params.id, function (err, session) {
    if (err) res.send(err);
    res.json({
      message: "sessions Detail Loading...",
      data: session,
    });
  });//}
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
  Ip.find({ip: clientIP}, function(err, client){
      console.log("..err")
      console.log(err)
      console.log("..client")
      console.log(client)
      //if(client.length > 0) {
  Session.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        start: new Date(req.body.start),
        end: new Date(req.body.end),
      },
    }
  )
    .then((session) => {
      if (session) {
        Participant.updateMany(
          {
            "session.number": session.number,
          },
          {
            $set: {
              "session.min": new Date(req.body.start),
              "session.max": new Date(req.body.end),
            },
          },
          function (err, participants) {
            if (err) throw err;

            console.log(JSON.stringify(participants));

            res.json({
              message: "session updated",
              data: session,
            });
          }
        );
      } else {
        res.json({
          message: "session not found",
          data: {},
        });
      }
    })
    .catch((err) => {
      res.json({
        message: "error",
        data: err,
      });
    });//}
  })
};

// Handle delete actions
exports.delete = function (req, res) {
  
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
  Session.remove(
    {
      _id: req.params.id,
    },
    function (err, session) {
      if (err) res.send(err);
      res.json({
        status: "success",
        message: "Session Deleted!",
      });
    }
  );
//}
})
};
