const express = require("express");
const app = express();
const db = require("./db.json");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/users", (req, res) => {
  res.status(200).send(db);
});
app.get("/users/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.send(400, { message: "islenemeyen veri.." });
  } else {
    const user = db.find((user) => user.id == req.params.id); // if is not it be undefined
    if (user) {
      res.send(200, user);
    } else {
      res.send(404, { message: "kullanici bulunamadi" });
    }
  }
});
app.post("/users", (req, res) => {
  const willSaveData = {
    id: new Date().getTime(),
    full_name: req.body.full_name,
    country: req.body.country,
    email: req.body.email,
    created_at: new Date(),
  };

  db.push(willSaveData);
  res.send(willSaveData);
});

app.patch("/users/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).send({ message: "islenemeyen veri.." });
  } else {
    const user = db.find((user) => user.id == req.params.id); // if is not it be undefined
    if (user) {
      //Kayıt değisikliği
      // pass by referance arastır
      // pass by value arastır
      Object.keys(req.body).forEach((key) => {
        user[key] = req.body[key];
      });
      res.status(200).send(user);
    } else {
      res.send(404, { message: "kullanici bulunamadi" });
    }
  }
});
app.delete("/users/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).send({ message: "islenemeyen veri.." });
  } else {
    const userIndex = db.findIndex((user) => user.id == req.params.id); // if is not it be undefined
    if (userIndex > -1) {
      db.splice(userIndex, 1);
      res.status(201).send({
        message: "kullanici silindi",
      });
    } else {
      res.status(404).send({ message: "kullanici bulunamadi" });
    }
  }
});

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portu uzerinde calisiyor`);
});
