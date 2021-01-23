import React, { useEffect, useState } from "react";
import requests from "../config/axios";
import { connect } from "react-redux";
import PostModal from "./PostModal";
import { setAlert } from "../actions/alert";
import { getPostImageUrl, getImageUrl } from "../config/firebase";
import { Link } from "react-router-dom";
import Comment from "./Comment";

const Post = ({ post, user, handlePostDelete, setAlert }) => {
  const { id, user_id, date_posted, photo } = post;
  const { id: userId, is_staff } = user;
  const [content, setContent] = useState(post.content);
  const [postCreator, setPostCreator] = useState(null);
  const [postModal, setPostModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [postCreatorImage, setPostCreatorImage] = useState(null);
  const [noOfLikes, setNoOfLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const changeLike = () => {
    if (isLiked) {
      requests
        .delete(`api/likes/${likeId}`)
        .then(() => {
          setIsLiked(false);
          setNoOfLikes(noOfLikes - 1);
        })
        .catch((e) => console.log(e.response.data));
    } else {
      requests
        .post("api/likes/", { userId, postId: id })
        .then(() => {
          setIsLiked(true);
          setNoOfLikes(noOfLikes + 1);
        })
        .catch((e) => console.log(e.response.data));
    }
  };

  const handleCommentDelete = (commentId) => {
    requests
      .delete(`/api/comments/${commentId}`)
      .then(() => {
        setComments((comments) =>
          comments.filter((comment) => comment.id !== commentId)
        );
      })
      .catch((e) => console.log(e.response.data));
  };

  const datePosted = new Date(date_posted);

  useEffect(() => {
    if (photo) {
      getPostImageUrl(photo, user_id).then((link) => setImageUrl(link));
    }
    requests
      .get(`/api/users/${user_id}`)
      .then((res) => {
        setPostCreator(res.data);
        if (res.data.photo)
          getImageUrl(res.data.photo).then((link) => setPostCreatorImage(link));
      })
      .catch((e) => console.log(e.response.data));

    requests
      .get(`/api/likes/${id}`)
      .then((res) => {
        setNoOfLikes(res.data.length);
        res.data.forEach(({ id, user_id }) => {
          if (user_id === userId) {
            setIsLiked(true);
            setLikeId(id);
          }
        });
      })
      .catch((e) => console.log(e.response.data));

    requests
      .get(`/api/comments/${id}`)
      .then((res) => setComments(res.data))
      .catch((e) => console.log(e.response.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  const handleEdit = async () => {
    if (content.length !== 0) {
      setEditMode(false);
      const res = await requests.patch("/api/posts", { id, content });
      setAlert(res.data, "success");
    } else setAlert("Can't be empty", "warning");
  };

  return postCreator ? (
    <div onClick={() => setPostModal(false)} className="post mt-2">
      {postCreator.id === userId || is_staff ? (
        <div className="post__actions d-flex">
          <i
            className="btn btn-sm btn-info fa fa-pencil-square-o"
            onClick={(e) => {
              e.stopPropagation();
              setTextareaHeight(
                e.target.parentNode.parentNode.childNodes[3].clientHeight
              );
              setEditMode(!editMode);
            }}
            aria-hidden="true"
          ></i>
          <i
            className="btn btn-sm btn-danger fa fa-trash-o postDltBtn ml-2"
            aria-hidden="true"
            onClick={(e) => {
              e.stopPropagation();
              setPostModal(!postModal);
            }}
          ></i>
        </div>
      ) : null}
      {postModal && (
        <PostModal handlePostDelete={handlePostDelete} postId={id} />
      )}
      <Link to={`/profile/${postCreator.id}`} className="post__header d-flex">
        <img
          src={
            postCreatorImage
              ? postCreatorImage
              : require("../assets/photos/userdefault.png").default
          }
          alt={postCreator.name}
        />
        <p className="ml-2">{postCreator.name}</p>
      </Link>
      <p className="post__timestamp">{datePosted.toLocaleDateString()}</p>
      {editMode ? (
        <textarea
          style={{ height: textareaHeight }}
          value={content}
          className="form-control mt-2"
          onChange={(e) => setContent(e.target.value)}
          name="content"
        />
      ) : (
        <div className="post__content text-start mt-2">{content}</div>
      )}
      {photo ? (
        <div className="post__image">
          <img src={imageUrl} alt="postphoto" />
        </div>
      ) : null}
      <div className="post__comments">
        <div className="d-flex mt-2 align-items-center">
          <p>Comments:</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              requests
                .post("/api/comments", {
                  userId,
                  postId: id,
                  text: commentText,
                })
                .then((res) =>
                  setComments((comments) => [...comments, res.data])
                )
                .catch((e) => console.log(e.response.data));
              setCommentText("");
            }}
            className="w-50"
          >
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              type="text"
              placeholder="Add a comment"
            />
          </form>
        </div>
        {comments.length > 0 &&
          comments.map((comment) => (
            <Comment
              handleDelete={handleCommentDelete}
              key={comment.id}
              comment={comment}
              postCreatorId={user_id}
            />
          ))}
      </div>
      <div className="post__likes">
        <div onClick={changeLike}>
          <p>{noOfLikes}</p>
          <i
            className={`fa fa-heart${!isLiked ? "-o" : ""} ms-1`}
            aria-hidden="true"
          ></i>
        </div>
      </div>
      {editMode && (
        <button
          onClick={handleEdit}
          className="post__saveBtn btn btn-sm btn-primary"
        >
          Save
        </button>
      )}
    </div>
  ) : null;
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { setAlert })(Post);
