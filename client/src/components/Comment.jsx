import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import requests from "../config/axios";

const Comment = ({ comment, user, handleDelete, postCreatorId }) => {
  const { id, text, user_id } = comment;
  const [commentCreator, setCommentCreator] = useState(null);

  useEffect(() => {
    comment &&
      requests
        .get(`/api/users/${user_id}`)
        .then((res) => setCommentCreator(res.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comment]);

  if (!commentCreator || !user) {
    return null;
  } else {
    const { name: userName } = commentCreator;
    const { is_staff, id: actorId } = user;
    return (
      <div className="comment mb-1">
        <p className="comment__user">{userName}</p>
        <p className="comment__text ms-2">{text}</p>
        {(user_id === actorId || postCreatorId === actorId || is_staff) && (
          <i
            onClick={() => handleDelete(id)}
            className="fa fa-trash-o btn btn-sm btn-danger"
          ></i>
        )}
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Comment);
