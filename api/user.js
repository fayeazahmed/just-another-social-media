const { Router } = require("express");
const client = require("./database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtsecret, storage, upload, bucketName } = require("./config");
const auth = require("./auth");
const router = Router();
const path = require("path");

router.get("/:id", auth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const response = await client.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", auth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, bio } = req.body;
    await client.query("UPDATE users SET name=$1, bio=$2 WHERE id=$3 ", [
      name,
      bio,
      id,
    ]);
    res.send(true);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const { password } = req.body;
    let user = await client.query("SELECT * FROM users WHERE id = $1", [id]);
    user = user.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      await client.query("DELETE FROM users WHERE id = $1", [id]);
      res.json({ message: "User deleted" });
    } else {
      res.status(401).json({ message: "Password does not match" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const response = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (response.rowCount === 0) {
      res.status(400).json({ message: "Email not found" });
    } else {
      const user = response.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        jwt.sign(
          { email, password },
          jwtsecret,
          { expiresIn: "1 days" },
          (err, token) => {
            if (err) throw err;
            res.json({ token, userId: user.id });
          }
        );
      } else {
        res.status(401).json({ message: "Password does not match" });
      }
    }
  } catch (error) {
    next(error);
  }
});

router.post("/new", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (password.length < 6) {
      res.status(412).send({ message: "Password must greater than 6" });
    }
    const response = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (response.rowCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await client.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, hashedPassword]
      );
      res.send(true);
    } else {
      res.status(412).json({ message: "Email already exists" });
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

router.post("/updatedp", auth, async (req, res, next) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        res.send("There was an error uploading the image.");
      } else {
        await storage
          .bucket(bucketName)
          .upload(path.join(__dirname, "../public/", req.file.filename), {
            destination: `User DP/${req.file.filename}`,
          });

        await client.query("UPDATE users SET photo=$1 WHERE id=$2 ", [
          req.file.filename,
          req.body.id,
        ]);
        res.send("Successfully updated");
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
