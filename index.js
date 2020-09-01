const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
const Image = require("./model/File");
const { loadavg } = require("os");
const fs = require("fs");

mongoose.connect(
  "mongodb+srv://Akash:Pass@123@using-multer.haidp.mongodb.net/using-multer?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
);

mongoose.connection.on("connected", function () {
  console.log("Database Connected");
});
mongoose.connection.on("disconnected", function () {
  console.log("Database disconnected");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use("/uploads", express.static(path.join(__dirname + "uploads")));

// Multer Save File Setup
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({
  storage: storage,
});

// Get Form
app.get("/", function (req, res) {
  res.render("form");
});

// Upload Image
app.post("/upload", upload.any(), function (req, res, next) {
  // console.log(req.files[0]);
  const newImage = new Image({
    name: req.body.name,
    size: req.files[0].size,
    mimetype: req.files[0].mimetype,
    path: req.files[0].path,
  });

  newImage.save((err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Saved", result);
    }
  });
  res.status(200);
  res.redirect("/");
});

//Get Image
app.get("/image/:slug", function (req, res) {
  var filename = req.params.slug;
  Image.findOne({ _id: filename }).then((image) => {
    const dest = path.join(__dirname + "\\") + image.path;
    res.sendFile(dest);
  });
});

app.listen(3000, function (err, result) {
  console.log("listening at 3000");
});
