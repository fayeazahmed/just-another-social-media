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

router.delete("/", auth, async (req, res, next) => {
  try {
    const { password, id } = req.body;
    let user = await client.query("SELECT * FROM users WHERE id = $1", [id]);
    user = user.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      await client.query("DELETE FROM users WHERE id = $1", [id]);
      res.send("Your account is deleted");
    } else {
      res.status(401).send("Password does not match");
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:accountId", auth, async (req, res, next) => {
  try {
    const { accountId } = req.params;
    await client.query("DELETE FROM users WHERE id = $1", [accountId]);
    res.send("Account deleted");
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
    const response = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (response.rowCount === 0) {
      if (password.length < 6) {
        res.status(412).send("Password must greater than 6");
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await client.query(
          "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
          [name, email, hashedPassword]
        );
        res.send("Account created successfully");
      }
    } else {
      res.status(412).send("Email already exists");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/changepassword", auth, async (req, res, next) => {
  try {
    const { password, password2, id } = req.body;
    const response = await client.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = response.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password2, salt);
      await client.query("UPDATE users SET password=$1 WHERE id=$2 ", [
        hashedPassword,
        id,
      ]);
      res.send("Password changed");
    } else {
      res.status(401).send("Passwords do not match");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/search", auth, async (req, res, next) => {
  try {
    const { searchTerm, userId } = req.body;
    const response = await client.query(
      `SELECT * FROM users WHERE UPPER(name) LIKE UPPER('%${searchTerm}%') AND NOT id = ${userId}`
    );
    if (response.rowCount === 0) {
      res.status(404).send("No user found");
    } else {
      res.send(response.rows);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/:id", auth, async (req, res, next) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        res.send("There was an error uploading the image.");
      } else {
        const id = req.params.id;
        const { name, bio, email } = req.body;
        let user = await client.query("SELECT * FROM users WHERE id=$1 ", [id]);
        user = user.rows[0];
        if (user.email !== email) {
          const validateMail = await client.query(
            "SELECT email FROM users WHERE email=$1 ",
            [email]
          );
          if (validateMail.rowCount !== 0) {
            res.status(400).send("Email already in use!");
          }
        } else {
          await client.query(
            "UPDATE users SET name=$1, bio=$2, email=$3 WHERE id=$4 ",
            [name, bio, email, id]
          );
        }
        if (req.file) {
          await storage
            .bucket(bucketName)
            .upload(path.join(__dirname, "../public/", req.file.filename), {
              destination: `User DP/${req.file.filename}`,
            });

          await client.query("UPDATE users SET photo=$1 WHERE id=$2 ", [
            req.file.filename,
            id,
          ]);
        }
        res.send("Changes are saved");
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
