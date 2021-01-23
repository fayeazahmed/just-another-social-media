const { Router } = require("express");
const client = require("./database");
const auth = require("./auth");
const router = Router();

router.get("/:id", auth, async (req, res, next) => {
  try {
    const postId = req.params.id;
    const response = await client.query(
      "SELECT * FROM comment WHERE post_id = $1",
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
    const text = req.body.text;
    const comment = await client.query(
      "INSERT INTO comment (text, post_id, user_id) VALUES ($1, $2, $3) RETURNING *",
      [text, postId, userId]
    );
    res.send(comment.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const commentId = req.params.id;
    await client.query("DELETE FROM comment WHERE id = $1", [commentId]);
    res.send("Comment deleted");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
