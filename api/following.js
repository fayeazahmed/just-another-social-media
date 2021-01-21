const { Router } = require("express");
const client = require("./database");
const auth = require("./auth");
const router = Router();

router.get("/:id", auth, async (req, res, next) => {
  try {
    const userId = req.params.id;
    const response = await client.query(
      "SELECT * FROM following WHERE follower = $1",
      [userId]
    );
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const followerId = req.body.followerId;
    const followeeId = req.body.followeeId;

    const isAlreadyFollowing = await client.query(
      "SELECT * FROM following WHERE follower = $1 AND followee = $2",
      [followerId, followeeId]
    );

    if (isAlreadyFollowing.rowCount === 0) {
      await client.query(
        "INSERT INTO following (follower, followee) VALUES ($1, $2) RETURNING *",
        [followerId, followeeId]
      );
      res.send("Started following");
    } else {
      res.send("Already following");
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/", auth, async (req, res, next) => {
  try {
    const followingId = req.body.followingId;
    await client.query("DELETE FROM following WHERE id = $1", [followingId]);
    res.send("Stopped following");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
