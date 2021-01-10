const { Router } = require("express");
const client = require("./database");
const auth = require("./auth");
const router = Router();

router.get("/", auth, async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const response = await client.query(
      "SELECT * FROM post WHERE user_id = $1",
      [userId]
    );
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const content = req.body.content;
    const photo = req.body.photo;
    await client.query(
      "INSERT INTO post (content, photo, user_id) VALUES ($1, $2, $3) RETURNING *",
      [content, photo, userId]
    );
    res.send("Post created");
  } catch (error) {
    next(error);
  }
});

router.patch("/", auth, async (req, res, next) => {
  try {
    const postId = req.body.postId;
    const content = req.body.content;
    await client.query("UPDATE post SET content = $1 WHERE id = $2", [
      content,
      postId,
    ]);
    res.send("Post edited");
  } catch (error) {
    next(error);
  }
});

router.delete("/", auth, async (req, res, next) => {
  try {
    const postId = req.body.postId;
    await client.query("DELETE FROM post WHERE id = $1", [postId]);
    res.send("Post deleted");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
