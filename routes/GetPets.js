const express = require("express");
const db = require("../db");
const router = express.Router();
const { ref, uploadBytes } = require("firebase/storage");
const storage = require("../config");


router.get("/all", (req, res) => {
  const sql = "SELECT * FROM `pets` LIMIT 10";
  db.query(sql, (error, results) => {
    if (error) {
      console.error(error.message);
    } else {
      // console.log(results);
      res.send(results);
    }
  });
});

router.put("/update", (req, res) => {
  // console.log(req.body);
  let pet = req.body;
  const sql = `UPDATE pets SET name = '${pet.name}',adopted ='${pet.adopted}', hypoallergenic = '${pet.hypoallergenic}',
  type = '${pet.type}', height = ${pet.height}, weight = ${pet.weight}, color = '${pet.color}', breed = '${pet.breed}', bio = "${pet.bio}"  WHERE id = '${pet.id}'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("pet updated");
      // console.log(result)
      res.send(pet);
    }
  });
});

router.put("/adoptOrFoster", (req, res) => {
  const user = req.body.user;
  const pet = { ...req.body.pet, owner: user.id };
  const sql = `UPDATE pets SET adopted = '${pet.adopted}', owner = '${user.id}' WHERE id = '${pet.id}'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("pet updated");
      res.send(pet);
    }
  });
});

router.get("/:owner", (req, res) => {
  // console.log(req.params.owner)
  const sql = `SELECT * FROM pets WHERE owner = '${req.params.owner}'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

router.get("/petid/:id", (req, res) => {
  // console.log(req.params.owner)
  const sql = `SELECT * FROM pets WHERE id = '${req.params.id}'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

router.put("/return", (req, res) => {
  const pet = req.body;
  const sql = `UPDATE pets SET adopted = 'not adopted', owner = '' WHERE id = '${pet.id}'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
      console.log("pet returned");
    }
  });
});

router.post("/save", (req, res) => {
  const sql = `INSERT INTO savedPets(petId,userId) VALUES ('${req.body.pet.id}','${req.body.user.id}')`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });
});

router.get("/getSavedPets/:id", (req, res) => {
  console.log(req.params.id)
  const sql2 = `SELECT * FROM savedPets LEFT JOIN pets ON savedPets.petId = pets.id WHERE savedPets.userId = '${req.params.id}'`;
  db.query(sql2, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

router.get("/checkSaved/:userId/:petId",(req, res)=>{
  console.log(req.params)
  const sql = `SELECT * FROM savedPets LEFT JOIN pets ON savedPets.petId = pets.id WHERE savedPets.userId = '${req.params.userId}' AND savedPets.petId = '${req.params.petId}'`;
   db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

router.delete("/unSave/:userId/:petId",(req,res)=>{
  const sql = `DELETE FROM savedPets WHERE userId = '${req.params.userId}' AND  petId = '${req.params.petId}'`
   db.query(sql, (err, result) => {
     if (err) {
       console.log(err);
     } else {
       console.log(result);
       res.send(result);
     }
   });
  
})

module.exports = router;  
