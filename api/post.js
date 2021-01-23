const { Router } = require("express");
const client = require("./database");
const auth = require("./auth");
const { storage, upload, bucketName } = require("./config");
const router = Router();
const path = require("path");

router.get("/:id", auth, async (req, res, next) => {
  try {
    const userId = req.params.id;
    const response = await client.query(
      "SELECT * FROM post WHERE user_id = $1 ORDER BY date_posted desc",
      [userId]
    );
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

router.post("/feed", auth, async (req, res, next) => {
  const getFollowingPosts = async (userId) => {
    const posts = await client.query(
      "SELECT * FROM post WHERE user_id = $1 ORDER BY date_posted desc",
      [userId]
    );
    return posts.rows;
  };

  try {
    const userId = req.body.id;
    let response = await client.query(
      "SELECT * FROM post WHERE user_id = $1 ORDER BY date_posted desc",
      [userId]
    );
    const posts = response.rows;
    response = await client.query(
      "SELECT followee FROM following WHERE follower = $1",
      [userId]
    );
    const followees = response.rows;
    for (const followee of followees) {
      const followeePosts = await getFollowingPosts(followee.followee);
      posts.unshift(...followeePosts);
    }

    res.send(posts);
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        res.send("There was an error uploading the image.");
      } else {
        let post = await client.query(
          "INSERT INTO post (content, user_id) VALUES ($1, $2) RETURNING *",
          [req.body.content, req.body.userId]
        );
        const postId = post.rows[0].id;
        if (req.file) {
          await storage
            .bucket(bucketName)
            .upload(path.join(__dirname, "../public/", req.file.filename), {
              destination: `User posts/${req.body.userId}/${req.file.filename}`,
            });
          post = await client.query(
            "UPDATE post SET photo=$1 WHERE id=$2 returning *",
            [req.file.filename, postId]
          );
        }
        res.send(post.rows[0]);
      }
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/", auth, async (req, res, next) => {
  try {
    const postId = req.body.id;
    const content = req.body.content;
    await client.query("UPDATE post SET content = $1 WHERE id = $2", [
      content,
      postId,
    ]);
    res.send("Post updated");
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
