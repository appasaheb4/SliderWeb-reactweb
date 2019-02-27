const express = require("express");
var cors = require("cors");
const path = require("path");
const mysql = require("mysql");
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(
  bodyParser.urlencoded({
    extended: true
  })
); // support encoded bodies

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));
app.use(cors());
// connection configurations
const connection = mysql.createConnection({
  host: "localhost",
  user: "webpanelim",
  password: "developer@1234",
  database: "admin_webpanelim"
});
// connect to database
connection.connect(function(err) {
  if (err) {
    return console.error("error: " + err.message);
  }
  console.log("Connected to the MySQL server.");
});
//TODO:Select
//TODO: getModels
app.get("/api/getModels", function(req, res) {
  connection.query("SELECT * FROM tblModels", function(error, results, fields) {
    if (error) throw error;
    return res.send({
      data: results
    });
  });
});
app.get("/api/getAllImages", function(req, res) {
  connection.query("SELECT * FROM tblModelImages", function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    return res.send({
      data: results
    });
  });
});
app.post("/api/getImages", function(req, res) {
  var modelName = req.body.modelName; //"P20 PRO";
  connection.query(
    "SELECT * FROM tblModelImages where  modelName= '" + modelName + "'",
    function(error, results, fields) {
      if (error) throw error;
      return res.send({
        data: results
      });
    }
  );
});
app.post("/api/loginUser", function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  connection.query(
    "SELECT * FROM tblUser where  email = '" +
      email +
      "' and password = '" +
      password +
      "'",
    function(error, results, fields) {
      if (error) {
        res.send({
          statusCode: 400,
          message: "error ocurred"
        });
      } else {
        if (results.length > 0) {
          res.send({
            statusCode: 200,
            message: "Login sccess",
            data: results
          });
        } else {
          res.send({
            statusCode: 204,
            message: "Please enter correct email and password."
          });
        }
      }
    }
  );
});
//TODO: Insert
//TODO: insert tblmodelImages
app.post("/api/insertImages", function(req, res) {
  var date = req.body.date;
  var title = req.body.title;
  var imagePath = req.body.imagePath;
  var price = req.body.price;
  var modelName = req.body.modelName;
  connection.query(
    "INSERT INTO tblModelImages (createDate,title,imagePath,price,modelName,userId,updateDate) VALUES ('" +
      date +
      "','" +
      title +
      "','" +
      imagePath +
      "'," +
      price +
      ",'" +
      modelName +
      "',1,'" +
      date +
      "')",
    function(err, result) {
      if (err) throw err;
      return res.send({
        data: "insertdata"
      });
    }
  );
});
const port = process.env.PORT || 3306;
app.listen(port);
console.log("App is listening on port " + port);
