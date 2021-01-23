import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import requests from "../config/axios";
import ReactLoading from "react-loading";
import Post from "./Post";
import { setAlert } from "../actions/alert";

const Feed = ({ user, setAlert }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const refreshFeed = async () => {
    const response = await requests.post("/api/posts/feed", { id: user.id });
    setPosts(response.data);
    setLoading(false);
  };

  const handlePostDelete = async (postId) => {
    const response = await requests.delete("/api/posts/", { data: { postId } });
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
    setAlert(response.data, "success");
  };

  useEffect(() => {
    user && refreshFeed();
    // eslint-disable-next-line
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content !== "") {
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("content", content);
      formData.append("image", image);
      requests.post("/api/posts/", formData).then((res) => {
        setContent("");
        setPosts([...posts, res.data]);
        setAlert("Content posted", "success");
      });
    }
  };

  return (
    <div className="feed container">
      {loading || !user ? (
        <ReactLoading
          className="m-auto"
          type="cubes"
          color="#c2c0b0"
          height={80}
          width={80}
        />
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div className="feed__user pt-2 d-flex">
              {user.photo ? (
                <img alt={user.name} src={user.photo} />
              ) : (
                <img
                  className="me-3"
                  alt={user.name}
                  src={require("../assets/photos/userdefault.png").default}
                />
              )}
              <p>{user.name}</p>
            </div>
            <div>
              <div className="feed__inputgroup">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  type="text"
                  placeholder="Post something..."
                  name="content"
                />
                <label
                  className="feedform__file btn btn-outline-secondary"
                  htmlFor="imagefile"
                >
                  Add photo{" "}
                  <i className="fa fa-file-image-o" aria-hidden="true"></i>
                  <input
                    onChange={(e) => setImage(e.target.files[0])}
                    type="file"
                    id="imagefile"
                    name="image"
                    className="d-none"
                  />
                </label>
                <button className="feedform__submit btn btn-primary">
                  Post <i className="fa fa-plus-square" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </form>
          <div className="feed_posts mt-3">
            {posts.map((post) => (
              <Post
                handlePostDelete={handlePostDelete}
                key={post.id}
                post={post}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { setAlert })(Feed);
