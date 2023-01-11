const express = require("express");
const db = require("../db");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/create", async (req, res) => {
  console.log(req.body);
  const newUser = { ...req.body, id: uuidv4() };
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(newUser.password, 8, (err, hash) => {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });
  const sql = `INSERT INTO users (firstName,lastName,password,email,phoneNumber,id) 
  VALUES ('${newUser.firstName}','${newUser.lastName}','${hashedPassword}','${newUser.email}','${newUser.phoneNumber}','${newUser.id}')`;
  db.query(sql, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("entry added");
      res.send(newUser);
    }
  });
});

router.get("/login", (req, res) => {
  const sql = `SELECT * FROM users WHERE email = '${req.query.email}'`;
  db.query(sql, async (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result.length > 0) {
      const check = await bcrypt.compare(
        req.query.password,
        result[0].password
      );
      if (!check) {
        res.send("invalid password");
      } else {
        const { id, isAdmin, firstName, lastName } = result[0];
        const token = jwt.sign(
          { id, isAdmin, firstName, lastName },
          "amir2580",
          {
            expiresIn: "90d",
          }
        );
        const cookieOptions = {
          expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          httpOnly: true,
          //   overwrite: true,
        };
        res.cookie("jwt", token, cookieOptions);
        // res.cookie("jwt", 123, cookieOptions);
        res.send({ approved: "loggedIn", token: result[0] });
      }
    } else {
      res.send("Invalid email");
    }
  });
});

router.get("/check", (req, res) => {
  //   console.log(req.cookies);
  if (req.cookies.jwt) {
    let token = jwt.verify(req.cookies.jwt, "amir2580");
    res.send({ approved: "loggedIn", token: token });
  }
});

router.put("/update", async (req, res) => {
  const user = req.body;
  //   console.log(user);

  let hashedPassword = null;
  if (user.password.length > 7) {
    hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(user.password, 8, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  }
  let sql = ``;
  if (user.firstName) {
    sql += `UPDATE users SET firstName = '${user.firstName}'`;
  }
  if (user.lastName && sql == ``) {
    sql += `UPDATE users SET lastName = '${user.lastName}'`;
  } else if (user.lastName) {
    sql += `, lastName = '${user.lastName}'`;
  }
  if (user.email && sql == ``) {
    sql += `UPDATE users SET email = '${user.email}'`;
  } else if (user.email) {
    sql += `, email = '${user.email}'`;
  }
  if (user.phoneNumber && sql == ``) {
    sql += `UPDATE users SET phoneNumber = '${user.phoneNumber}'`;
  } else if (user.phoneNumber) {
    sql += `, phoneNumber = '${user.phoneNumber}'`;
  }
  if (hashedPassword && sql == ``) {
    sql += `UPDATE users SET password = '${hashedPassword}'`;
  } else if (hashedPassword) {
    sql += `, password = '${hashedPassword}'`;
  }
  if (sql) {
    sql += `WHERE id = '${user.id}'`;
    db.query(sql, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.log("user updated");
        db.query(
          `SELECT * FROM users WHERE id = '${user.id}'`,
          (err, result) => {
            console.log({ ...result[0] });
            const token = jwt.sign({ ...result[0] }, "amir2580", {
              expiresIn: "90d",
            });
            const cookieOptions = {
              expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
              httpOnly: true,
            };
            res.cookie("jwt", token, cookieOptions);
            res.send({ approved: "loggedIn", token: result[0] });
          }
        );
      }
    });
  }
});

router.get("/logout", (req, res) => {
  res.cookie("jwt", {}, { expires: new Date(Date.now() + 1), httpOnly: true });
  res.send({ approved: "loggedOut" });
  console.log("cookie deleted");
});

router.get("/all", (req, res) => {
  const sql = `SELECT * FROM users`;
  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.send(results);
    }
  });
});

router.put("/makeAdmin",(req,res)=>{
  // console.log(req.body)
  const sql = `UPDATE users SET isAdmin = 'true' WHERE id = '${req.body.id}'`;
  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.log("new admin!")
      res.send(results)
    }
  });
})

module.exports = router;
