const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fs = require("fs");
require("dotenv").load();

const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const app = express();
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(__dirname + "/styles"));
app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const data = {
    person: {
      firstName: "Preston",
      lastName: "Hill"
    }
  };

  res.render("./pages/index", data);
});


app.post("/thanks", (req, res) => {
  const str = req.body.name;
  const newString = str
    .split(" ")
    .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
    .join(" ");
  const newData = {
    thanks: true,
    name: newString
  };
  client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: process.env.CELL_PHONE_NUMBER,
    body:
      newString +
      ' has left you the following message. "' +
      req.body.message +
      '" Their email address is ' +
      req.body._replyto
  });
  res.render("pages/index", newData);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("listening at localhost:8080");
});

module.exports = app;
