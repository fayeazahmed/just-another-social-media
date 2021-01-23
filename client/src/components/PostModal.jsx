import React from "react";

const PostModal = ({ postId, handlePostDelete }) => {
  return (
    <div className="post__modal">
      <p>Confirm delete: </p>
      <button
        onClick={() => handlePostDelete(postId)}
        className="btn btn-sm btn-danger w-100 mt-1"
      >
        Delete
      </button>
    </div>
  );
};

export default PostModal;
