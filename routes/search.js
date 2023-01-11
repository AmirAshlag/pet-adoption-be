const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/pet", (req, res) => {
  // console.log(req.query);
  const sql = `SELECT * FROM pets WHERE type = '${req.query.type}'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(result)
      res.send(result);
    }
  });
});

router.get("/animal", (req, res) => {
  //   console.log(req.query);
  let sql = ``;
  if (req.query.type) {
    sql += `SELECT * FROM pets WHERE type = '${req.query.type}'`;
  }
  if (req.query.color && sql == ``) {
    sql += `SELECT * FROM pets WHERE color LIKe '%${req.query.color}%'`;
  } else if (req.query.color) {
    sql += `AND color LIKe '%${req.query.color}%'`;
  }
  if (req.query.adopted && sql == ``) {
    sql += `SELECT * FROM pets WHERE adopted = '${req.query.adopted}'`;
  } else if (req.query.adopted) {
    sql += `AND adopted = '${req.query.adopted}'`;
  }
  if (req.query.hypoallergenic && sql == ``) {
    sql += `SELECT * FROM pets WHERE hypoallergenic = '${req.query.hypoallergenic}'`;
  } else if (req.query.hypoallergenic) {
    sql += `AND hypoallergenic = '${req.query.hypoallergenic}'`;
  }
  if (req.query.height && sql == ``) {
    sql += `SELECT * FROM pets WHERE height BETWEEN ${Math.ceil(req.query.height/1.15)} AND ${Math.ceil(req.query.height * 1.15)}`;
  } else if (req.query.height) {
    sql += `AND height BETWEEN ${Math.ceil(req.query.height/1.15)} AND ${Math.ceil(req.query.height * 1.15)}`;
  }
  if (req.query.weight && sql == ``) {
    sql += `SELECT * FROM pets WHERE weight BETWEEN ${Math.ceil(req.query.weight/1.15)} AND ${Math.ceil(req.query.weight * 1.15)}`;
  } else if (req.query.weight) {
    sql += `AND weight BETWEEN ${Math.ceil(req.query.weight/1.15)} AND ${Math.ceil(req.query.weight * 1.15)}`;
  }
  console.log(Math.ceil(req.query.weight * 1.15));
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

module.exports = router;

// `SELECT * FROM pets WHERE type LIKE '%${req.query.type}%'`;
