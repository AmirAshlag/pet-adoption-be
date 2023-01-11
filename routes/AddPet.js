const express = require("express");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");
const router = express.Router();

router.post("/", (req, res) => {
  const newPet = { ...req.body, id: uuidv4() };
  const sql = `INSERT INTO pets (name, adopted, hypoallergenic, type, height, weight, color, breed, id, bio) 
  VALUES ('${newPet.name}','${newPet.adopted}','${newPet.hypoallergenic}','${newPet.type}',${newPet.height},${newPet.weight},'${newPet.color}','${newPet.breed}','${newPet.id}','${newPet.bio}')`;

  console.log(newPet);
  db.query(sql, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("entry added");
      res.send(newPet);
    }
  });
});

module.exports = router;
