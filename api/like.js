const { Router } = require("express");
const client = require("./database");
const auth = require("./auth");
const e = require("express");
const router = Router();

router.get("/:id", auth, async (req, res, next) => {
  try {
    const postId = req.params.id;
    const response = await client.query(
      "SELECT * FROM likes WHERE post_id = $1",
      [postId]
    );
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const postId = req.body.postId;
    const userId = req.body.userId;

    const isAlreadyLiked = await client.query(
      "SELECT * FROM likes WHERE post_id = $1 AND user_id = $2",
      [postId, userId]
    );

    if (isAlreadyLiked.rowCount === 0) {
      await client.query(
        "INSERT INTO likes (post_id, user_id) VALUES ($1, $2) RETURNING *",
        [postId, userId]
      );
      res.send("Like added");
    } else {
      res.send("Post is already liked");
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const likeId = req.params.id;
    await client.query("DELETE FROM likes WHERE id = $1", [likeId]);
    res.send("Like removed");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
